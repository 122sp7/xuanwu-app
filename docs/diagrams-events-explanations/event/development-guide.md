---
title: Event Core development guide
description: Developer guide for contributing to event-core — publishing domain events, implementing adapters, dispatch policy, and testing patterns.
---

# Event Core 開發指南

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：參與 `modules/event` 實作或在各模組中發布領域事件的工程師

---

## 前置閱讀

開始任何 Event Core 相關實作前，請先閱讀：

1. **架構規範**：`docs/decision-architecture/architecture/event.md`
2. **開發契約**：`docs/development-reference/development-reference/reference/development-contracts/event-contract.md`
3. **整體架構指南**：`agents/knowledge-base.md`

---

## 1. 模組結構

```
modules/event/
├── domain/
│   ├── entities/
│   │   └── domain-event.entity.ts       # DomainEvent class
│   ├── repositories/
│   │   ├── ievent-bus.repository.ts     # IEventBusRepository port
│   │   └── ievent-store.repository.ts   # IEventStoreRepository port
│   ├── services/
│   │   └── dispatch-policy.ts           # shouldRetry, nextRetryDelayMs (純函式)
│   └── value-objects/
│       └── event-metadata.vo.ts         # EventMetadata
├── application/
│   └── use-cases/
│       ├── publish-domain-event.ts      # PublishDomainEventUseCase
│       └── list-events-by-aggregate.ts  # ListEventsByAggregateUseCase
├── infrastructure/
│   ├── persistence/
│   │   └── config.ts                   # EVENT_CORE_CONFIG
│   └── repositories/
│       ├── in-memory-event-store.repository.ts
│       └── noop-event-bus.repository.ts
├── interfaces/
│   └── api/
│       └── event.controller.ts         # EventController
└── index.ts
```

### 依賴方向（嚴格）

```
interfaces (api / controller)
    ↓
application (use-cases)
    ↓
domain (entities / repositories / services / value-objects)
    ↑
infrastructure (adapters)
```

> ❗ 禁止 domain 直接 import infrastructure；禁止 application 直接 import UI 元件；禁止任何層直接 import `@/modules/*`。

---

## 2. 從模組發布領域事件

### 2.1 標準發布流程

在任何模組的 write-side use-case 中注入 `PublishDomainEventUseCase`，在業務操作完成後發布事件：

```typescript
// modules/task/application/use-cases/assign-task.use-case.ts
import { PublishDomainEventUseCase } from '@/modules/event'
import type { ITaskRepository } from '../domain/repositories/itask.repository'

export class AssignTaskUseCase {
  constructor(
    private readonly taskRepo: ITaskRepository,
    private readonly publishEvent: PublishDomainEventUseCase,
  ) {}

  async execute(dto: { taskId: string; assigneeId: string; actorId: string }) {
    const task = await this.taskRepo.findById(dto.taskId)
    task.assign(dto.assigneeId)
    await this.taskRepo.save(task)

    await this.publishEvent.execute({
      id:            crypto.randomUUID(),
      eventName:     'Task.Task.Assigned',
      aggregateType: 'Task',
      aggregateId:   dto.taskId,
      payload:       { assigneeId: dto.assigneeId },
      metadata:      { actorId: dto.actorId },
      occurredAt:    new Date(),
    })
  }
}
```

### 2.2 eventName 命名規則

```
{ModulePrefix}.{AggregateType}.{PastTenseAction}

合法範例：
  Wiki.WikiDocument.Created
  Task.Task.Assigned
  Schedule.ScheduleRequest.Submitted
  Billing.Invoice.Issued
  Daily.DailyEntry.Published
```

---

## 3. 實作新的 EventStore Adapter

當需要從 in-memory 切換到真實持久層（Firestore、Postgres 等）時：

### 3.1 建立 adapter

```typescript
// modules/{module}/infrastructure/firebase/FirebaseEventStoreRepository.ts
import type { IEventStoreRepository } from '@/modules/event'
import { DomainEvent } from '@/modules/event'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, Timestamp } from 'firebase/firestore'

export class FirebaseEventStoreRepository implements IEventStoreRepository {
  private readonly db = getFirestore()

  async save(event: DomainEvent): Promise<void> {
    const ref = doc(collection(this.db, 'domain_events'), event.id)
    await setDoc(ref, {
      id:            event.id,
      eventName:     event.eventName,
      aggregateType: event.aggregateType,
      aggregateId:   event.aggregateId,
      occurredAt:    Timestamp.fromDate(event.occurredAt),
      payload:       event.payload,
      metadata:      event.metadata,
      dispatchedAt:  event.dispatchedAt ? Timestamp.fromDate(event.dispatchedAt) : null,
    })
  }

  async findById(id: string): Promise<DomainEvent | null> {
    const snap = await getDoc(doc(collection(this.db, 'domain_events'), id))
    if (!snap.exists()) return null
    return this.toDomain(snap.data())
  }

  async findByAggregate(aggregateType: string, aggregateId: string): Promise<DomainEvent[]> {
    const q = query(
      collection(this.db, 'domain_events'),
      where('aggregateType', '==', aggregateType),
      where('aggregateId', '==', aggregateId),
      orderBy('occurredAt', 'asc'),
    )
    const snaps = await getDocs(q)
    return snaps.docs.map((d) => this.toDomain(d.data()))
  }

  async findUndispatched(limitCount: number): Promise<DomainEvent[]> {
    const q = query(
      collection(this.db, 'domain_events'),
      where('dispatchedAt', '==', null),
      orderBy('occurredAt', 'asc'),
      limit(limitCount),
    )
    const snaps = await getDocs(q)
    return snaps.docs.map((d) => this.toDomain(d.data()))
  }

  async markDispatched(id: string, dispatchedAt: Date): Promise<void> {
    const ref = doc(collection(this.db, 'domain_events'), id)
    await updateDoc(ref, { dispatchedAt: Timestamp.fromDate(dispatchedAt) })
  }

  private toDomain(data: Record<string, unknown>): DomainEvent {
    return new DomainEvent(
      data.id as string,
      data.eventName as string,
      data.aggregateType as string,
      data.aggregateId as string,
      (data.occurredAt as Timestamp).toDate(),
      data.payload as Record<string, unknown>,
      data.metadata as Record<string, unknown>,
      data.dispatchedAt ? (data.dispatchedAt as Timestamp).toDate() : null,
    )
  }
}
```

### 3.2 注意事項

- `findByAggregate` 需要 Firestore composite index：`aggregateType ASC` + `aggregateId ASC` + `occurredAt ASC`。
- `findUndispatched` 需要 index：`dispatchedAt ASC` + `occurredAt ASC`。

---

## 4. 使用 Dispatch Policy

dispatch policy 是 domain/services 的純函式，可在任何地方直接 import 使用：

```typescript
import { shouldRetry, nextRetryDelayMs } from '@/modules/event'
import { EVENT_CORE_CONFIG } from '@/modules/event/infrastructure/persistence/config'

const policy = { maxRetries: EVENT_CORE_CONFIG.DISPATCH.RETRY_LIMIT, baseDelayMs: 500 }

if (shouldRetry({ attemptCount: attempt, lastAttemptAt: new Date() }, policy)) {
  const delay = nextRetryDelayMs({ attemptCount: attempt, lastAttemptAt: new Date() }, policy)
  await sleep(delay)
  // 重試派送
}
```

---

## 5. 測試模式

### 5.1 使用 InMemoryEventStoreRepository

```typescript
import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from '@/modules/event'

describe('AssignTaskUseCase', () => {
  it('publishes Task.Task.Assigned event', async () => {
    const store = new InMemoryEventStoreRepository()
    const bus = new NoopEventBusRepository()
    const publishEvent = new PublishDomainEventUseCase(store, bus)

    // ... use-case execution

    const events = await store.findByAggregate('Task', taskId)
    expect(events).toHaveLength(1)
    expect(events[0].eventName).toBe('Task.Task.Assigned')
  })
})
```

### 5.2 驗證 domain service 純函式

```typescript
import { shouldRetry, nextRetryDelayMs } from '@/modules/event'

describe('dispatchPolicy', () => {
  const policy = { maxRetries: 3, baseDelayMs: 500 }

  it('allows retry when attemptCount < maxRetries', () => {
    expect(shouldRetry({ attemptCount: 2, lastAttemptAt: null }, policy)).toBe(true)
  })

  it('disallows retry when attemptCount >= maxRetries', () => {
    expect(shouldRetry({ attemptCount: 3, lastAttemptAt: null }, policy)).toBe(false)
  })

  it('computes exponential delay', () => {
    expect(nextRetryDelayMs({ attemptCount: 1, lastAttemptAt: null }, policy)).toBe(1000)
  })
})
```

---

## 6. 常見錯誤

| 錯誤 | 原因 | 修正 |
|------|------|------|
| `eventName is required` | `eventName` 傳入空字串 | 確認 eventName 非空且有意義 |
| `aggregateType is required` | 未傳入聚合類型 | 傳入 `'Task'`、`'WikiDocument'` 等具體類型 |
| `aggregateId is required` | 未傳入聚合 ID | 傳入對應業務 ID |
| dispatch 後仍顯示 undispatched | `markDispatched` 未執行 | 確認 `PublishDomainEventUseCase` 正確呼叫後確認 |

---

## 7. 驗證指令

```bash
# Lint
npm run lint

# Build
npm run build
```
