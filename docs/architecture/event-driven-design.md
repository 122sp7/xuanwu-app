# Event-Driven Design

系統的狀態變更以 **domain event** 作為事實記錄，跨主域的非同步流以 **event bus（QStash）** 傳遞。事件描述「已發生的事實」，不是命令。

## 核心原則

1. **事件是事實，不是命令**：`WorkspaceCreated`（已建立）而不是 `CreateWorkspace`（請建立）
2. **持久化先，發布後**：aggregate 必須先存入 Firestore，再發布事件，確保一致性
3. **At-Least-Once 語意**：事件傳遞以 QStash 的 at-least-once 為基準，消費端必須設計為冪等
4. **事件不跨越非法依賴方向**：上游可以向下游發布事件，但下游不可向上游發布要求治理決策的事件

---

## Domain Event 結構規範

所有 domain event 必須繼承以下基礎欄位，並以 Zod schema 定型：

```typescript
// modules/shared/domain/events.ts（或各 module 的 domain/events/base.ts）
import { z } from 'zod';

export const DomainEventBaseSchema = z.object({
  type: z.string(),              // discriminant，格式：<module-name>.<action>
  eventId: z.string().uuid(),    // 每次發出唯一 ID（用於去重與 idempotency key）
  occurredAt: z.string().datetime(), // ISO 8601 字串，不使用 Date 物件
});

export type DomainEventBase = z.infer<typeof DomainEventBaseSchema>;
```

### Discriminant 命名規範

格式：`<module-name>.<action>`（全小寫，連字號分隔）

| ✅ 正確 | ❌ 錯誤 |
|---|---|
| `workspace.created` | `WorkspaceCreated` |
| `notion.knowledge-artifact.published` | `notion_knowledge_artifact_published` |
| `platform.subscription.activated` | `SubscriptionActivated` |
| `notebooklm.synthesis.completed` | `notebooklm/synthesis/completed` |

### 完整 Domain Event 定義範例

```typescript
// modules/workspace/domain/events/workspace-created.event.ts
import { z } from 'zod';
import { DomainEventBaseSchema } from '@shared/domain/events';

export const WorkspaceCreatedEventSchema = DomainEventBaseSchema.extend({
  type: z.literal('workspace.created'),
  payload: z.object({
    workspaceId: z.string().uuid(),
    organizationId: z.string().uuid(),
    name: z.string(),
    ownerId: z.string(),
    createdAt: z.string().datetime(),
  }),
});

export type WorkspaceCreatedEvent = z.infer<typeof WorkspaceCreatedEventSchema>;
```

---

## 事件發布流程（三步驟）

```typescript
// modules/workspace/application/use-cases/create-workspace.use-case.ts
export class CreateWorkspaceUseCase {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(input: CreateWorkspaceCommand): Promise<CommandResult> {
    // Step 1：執行 domain 邏輯，aggregate 內部累積 events
    const workspace = Workspace.create(generateId(), input);

    // Step 2：先持久化（必須在發布前完成）
    await this.workspaceRepository.save(workspace);

    // Step 3：提取並發布事件（Firestore 成功後才發布）
    const events = workspace.pullDomainEvents();
    await this.eventPublisher.publishAll(events);

    return { success: true, aggregateId: workspace.id };
  }
}
```

**不可**在持久化前發布事件，否則可能發布了事件但 aggregate 儲存失敗。

---

## 跨主域事件流

事件在主域間以 published language 包裝後傳遞，下游主域只訂閱與自身邏輯相關的事件，並以 ACL 或 Conformist 轉譯為本地語言：

```
billing emits: billing.subscription.activated
    ↓ (QStash)
workspace subscribes: maps to local MembershipEntitlementUpdated
notion subscribes: maps to local ContentCapabilityGranted
notebooklm subscribes: maps to local AICapabilityGranted
```

下游主域**不直接使用**上游 event payload 的型別作為本地 domain model。

---

## QStash — 非同步事件傳遞

**QStash** 是跨主域非同步事件傳遞的 message queue，採 at-least-once 語意。

### 使用場景

- 跨主域的非同步觸發（例如 iam / billing / ai → workspace / notion / notebooklm）
- 長時間執行的背景工作（embedding pipeline、ingestion job）
- 需要可重試的 side effect（通知、webhook 回呼）

### 冪等性要求

消費端**必須**設計為冪等，以 `eventId` 作為 idempotency key：

```typescript
// 消費端 Cloud Function 範例
export async function onWorkspaceCreated(event: WorkspaceCreatedEvent) {
  // 先檢查是否已處理過（冪等保護）
  const alreadyProcessed = await idempotencyStore.check(event.eventId);
  if (alreadyProcessed) return;

  // 業務邏輯...
  await processEvent(event);

  // 標記為已處理
  await idempotencyStore.mark(event.eventId);
}
```

### 不應使用 QStash 的場景

- 同一主域內的同步 domain event 發布（直接在 use case 中 `eventPublisher.publishAll()`）
- 需要強一致性 / 同步回應的跨主域請求（改用同步 API call）

---

## `occurredAt` — 型別規範

- `occurredAt` 必須使用 **ISO 8601 字串**（`z.string().datetime()`）
- 不使用 `Date` 物件（無法序列化、跨 Server/Client 邊界不安全）
- 不使用 Firestore `Timestamp`（domain 不依賴 Firestore 型別）

```typescript
// ✅ 正確
occurredAt: new Date().toISOString()   // "2026-04-14T09:00:00.000Z"

// ❌ 錯誤
occurredAt: new Date()                 // Date 物件
occurredAt: Timestamp.now()            // Firestore Timestamp（domain 不能有此依賴）
```

---

## 跨 Server/Client 邊界的序列化

事件或包含 `Date`、`Map`、`Set` 等型別的資料跨越 Server/Client 邊界時，使用 **SuperJSON** 序列化：

- Server Action 輸出端序列化
- Client 端以 SuperJSON 還原

---

## 禁止模式

- ❌ 持久化前發布事件（會導致 event 與 aggregate 狀態不一致）
- ❌ 下游直接用上游 event payload 型別作為本地 domain model
- ❌ 消費端沒有冪等保護（at-least-once 語意下必須冪等）
- ❌ `occurredAt` 使用 `Date` 物件或 `Firestore.Timestamp`
- ❌ Discriminant 使用 PascalCase 或底線（應是 `module-name.action` 小寫連字號）
- ❌ Event payload 沒有 Zod schema 定型（不允許 `any`）

---

## Document Network

- [firebase-architecture.md](./firebase-architecture.md)
- [state-machine-model.md](./state-machine-model.md)
- [`../.github/instructions/event-driven-state.instructions.md`](../../.github/instructions/event-driven-state.instructions.md)
- [`docs/hard-rules-consolidated.md`](../hard-rules-consolidated.md)
