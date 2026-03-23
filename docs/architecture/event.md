---
title: Event Core architecture
description: Target architecture for the event-core domain — canonical domain event capture, persistence, dispatch, and aggregate correlation in Xuanwu MDDD.
status: "🚧 Developing"
---

# Event Core 領域事件架構規範

> **文件編號**：XUANWU-EVENT-SPEC-001
> **適用系統**：xuanwu-app — 領域事件捕捉、持久化與派送核心
> **版本**：v1.0.0
> **最後更新**：2026-03-20
> **維護責任方**：Event Core Owner / 平台架構委員會
> **開發狀態**：🚧 Developing — 積極開發中

---

## 0. 目前已上線範圍

目前 Event Core 已具備最小可運作的領域事件基礎骨架，作為後續全系統事件驅動設計的入口：

- **DomainEvent 實體**：`modules/event/domain/entities/domain-event.entity.ts`
  - 功能：事件 id、名稱、聚合類型、聚合 id、occurredAt、payload、metadata、派送狀態
- **EventMetadata 值物件**：關聯 id、causation id、actor id、組織 / 工作區追蹤欄位
- **Repository ports**：`IEventStoreRepository`（持久化）+ `IEventBusRepository`（派送）
- **Domain service**：`dispatchPolicy`（純函式 — 重試判斷與 back-off 計算）
- **Use Cases**：`PublishDomainEventUseCase`、`ListEventsByAggregateUseCase`
- **In-memory adapters**：本地開發與測試用
- **Noop event bus**：scaffold / 測試用

### 0.1 本輪交付目標

本輪先建立 Event Core 的完整設計文件：

| 文件 | 路徑 |
|------|------|
| 架構設計（本文件） | `docs/architecture/event.md` |
| 開發契約 | `docs/reference/development-contracts/event-contract.md` |
| 開發指南 | `docs/event/development-guide.md` |
| 使用手冊 | `docs/event/user-manual.md` |

### 0.2 本輪不在交付範圍

- Firestore / Redis 實作的 event store adapter
- 真正的 message bus（Pub/Sub / Kafka / Cloud Tasks）adapter
- Event sourcing 完整 aggregate rebuild
- Dead-letter queue / 補償事務
- Event replay 與時間旅行 debug
- Cross-module event subscription / projection 自動觸發

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **事件即真相** | `DomainEvent` 是系統狀態變更的唯一記錄，不依賴 UI 呼叫順序 |
| **捕捉 → 持久化 → 派送** | 事件先寫入 store，再送出匯流排，保證 at-least-once 語意 |
| **聚合根關聯** | 所有事件透過 `aggregateType` + `aggregateId` 組成可查詢的事件時間線 |
| **純粹 domain** | Domain layer 不含任何 SDK/HTTP/DB 依賴，dispatch policy 以純函式表達 |
| **可替換 adapter** | Infrastructure 可從 in-memory 替換為 Firestore、Pub/Sub，不影響 domain |

---

## 2. Event Core 整體架構

### 2.1 模組邊界

```
app/(shell)/ 或 modules/*
    ↓ (invoke server actions / use-cases)
modules/event/interfaces/api/
    ↓
modules/event/application/use-cases/
    ↓
modules/event/domain/
    ↑
modules/event/infrastructure/
```

### 2.2 事件生命週期

```
捕捉（Capture）
    → 建立 DomainEvent（entity + metadata）
    → 驗證 eventName / aggregateType / aggregateId
持久化（Persist）
    → IEventStoreRepository.save(event)
    → 狀態：undispatched
派送（Dispatch）
    → IEventBusRepository.publish(event)
    → dispatchPolicy：retry eligibility + backoff
    → 標記：IEventStoreRepository.markDispatched(id, dispatchedAt)
觀察（Observe）
    → 查詢 findUndispatched → 補償重試
關聯（Correlate）
    → findByAggregate(aggregateType, aggregateId)
    → 重建事件時間線
```

---

## 3. DomainEvent 資料模型

### 3.1 DomainEvent 欄位

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `id` | `string` | ✅ | UUID v4，全域唯一 |
| `eventName` | `string` | ✅ | 事件名稱，格式建議 `{Module}.{AggregateType}.{Action}` |
| `aggregateType` | `string` | ✅ | 聚合根類型，例如 `WikiDocument`、`Task` |
| `aggregateId` | `string` | ✅ | 聚合根 ID |
| `occurredAt` | `Date` | ✅ | 事件實際發生時間 |
| `payload` | `DomainEventPayload` | ✅ | 事件業務資料（`Record<string, unknown>`） |
| `metadata` | `EventMetadata` | ❌ | 追蹤與關聯欄位（correlationId、actorId 等） |
| `dispatchedAt` | `Date \| null` | ❌ | 成功派送時間；null 代表尚未派送 |

### 3.2 EventMetadata 欄位

| 欄位 | 說明 |
|------|------|
| `correlationId` | 跨服務追蹤用 correlation id |
| `causationId` | 觸發此事件的上游事件 id |
| `actorId` | 發起事件的 accountId |
| `organizationId` | 所屬組織（多租戶隔離） |
| `workspaceId` | 所屬工作區（null = 組織層） |
| `traceId` | 分散式追蹤 id（OpenTelemetry） |

### 3.3 eventName 命名規範

```
{ModulePrefix}.{AggregateType}.{PastTenseAction}

範例：
  Wiki.WikiDocument.Created
  Task.Task.Assigned
  Schedule.ScheduleRequest.Submitted
  Billing.Invoice.Issued
```

---

## 4. 關鍵技術觀念

### 4.1 Outbox Pattern（目標）

為確保 at-least-once 派送語意，目標實作採用 outbox 模式：

```
write-side use-case:
  1. 寫入業務 aggregate（例如 Firestore document）
  2. 在同一 transaction 中寫入 domain_events（status: undispatched）

背景任務（outbox worker）:
  1. findUndispatched(limit)
  2. IEventBusRepository.publish(event)
  3. markDispatched(id, dispatchedAt)
```

> ❗ 目前骨架直接在 use-case 中呼叫 publish，尚未實作 outbox transaction。

### 4.2 Dispatch Policy（純函式）

`dispatchPolicy` 住在 domain/services，保持純函式：

```typescript
// 判斷是否應重試
shouldRetry({ attemptCount: 2, lastAttemptAt: new Date() }, { maxRetries: 3, baseDelayMs: 500 })
// → true

// 計算下次延遲（exponential back-off）
nextRetryDelayMs({ attemptCount: 1, lastAttemptAt: new Date() }, { maxRetries: 3, baseDelayMs: 500 })
// → 1000ms
```

### 4.3 Infrastructure 配置

```typescript
// modules/event/infrastructure/persistence/config.ts
EVENT_CORE_CONFIG = {
  DISPATCH: { BATCH_SIZE: 100, RETRY_LIMIT: 3 },
  STORE:    { TABLE: 'domain_events' },
}
```

---

## 5. 模組結構（目標）

```
modules/event/
├── domain/
│   ├── entities/
│   │   └── domain-event.entity.ts     # DomainEvent class + DomainEventPayload
│   ├── repositories/
│   │   ├── ievent-bus.repository.ts   # IEventBusRepository port
│   │   └── ievent-store.repository.ts # IEventStoreRepository port
│   ├── services/
│   │   └── dispatch-policy.ts        # shouldRetry, nextRetryDelayMs (pure)
│   └── value-objects/
│       └── event-metadata.vo.ts      # EventMetadata
├── application/
│   └── use-cases/
│       ├── publish-domain-event.ts   # PublishDomainEventUseCase
│       └── list-events-by-aggregate.ts # ListEventsByAggregateUseCase
├── infrastructure/
│   ├── persistence/
│   │   └── config.ts                 # EVENT_CORE_CONFIG
│   └── repositories/
│       ├── in-memory-event-store.repository.ts
│       └── noop-event-bus.repository.ts
├── interfaces/
│   └── api/
│       └── event.controller.ts       # EventController
├── index.ts                          # 模組公開 API
├── README.md
└── AGENT.md
```

---

## 6. 一句話總結

```
事件進來：Capture → Persist（undispatched） → Dispatch → markDispatched

事件查詢：findByAggregate → 重建事件時間線

事件重試：findUndispatched → dispatchPolicy → publish → markDispatched
```

---

## 7. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-20 | 初版建立，涵蓋 Event Core 目標架構、DomainEvent 資料模型、Outbox Pattern、dispatch policy | xuanwu-app 架構委員會 |
