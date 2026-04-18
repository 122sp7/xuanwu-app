# 4202 Inconsistency — UUID v7 用於 workspace domain event factory（全 repo 均使用 v4）

- Status: Resolved
- Resolved: 2026-04-14
- Date: 2026-04-14
- Category: Maintainability Smells > Inconsistency

## Context

ADR 4101（`v4 as uuid` in domain layer）確立了 domain 層和 application 層統一使用
`import { v4 as uuid } from "@infra/uuid"` 的規範，禁止使用 Node.js `crypto.randomUUID()`。

掃描 domain 層 UUID 使用情況：

```
# domain aggregates（全部使用 v4）
Account.ts:             import { v4 as uuid } from "@infra/uuid"
Organization.ts:        import { v4 as uuid } from "@infra/uuid"
KnowledgePage.ts:       import { v4 as uuid } from "@infra/uuid"
Article.ts:             import { v4 as uuid } from "@infra/uuid"
KnowledgeCollection.ts: import { v4 as uuid } from "@infra/uuid"
EntitlementGrant.ts:    import { v4 as uuid } from "@infra/uuid"
Workspace.ts:           import { v4 as uuid } from "@infra/uuid"
# ... (全部 16 個已確認的 domain aggregate files 使用 v4)

# domain event factory（例外）
workspace/domain/events/workspace.events.ts:  import { v7 } from "@infra/uuid"  ← ❌
```

`workspace/domain/events/workspace.events.ts` 是 **repo 中唯一在 domain 層使用 UUID v7 的文件**。

### UUID v4 vs v7 的差異

| 特性 | UUID v4 | UUID v7 |
|------|---------|---------|
| 格式 | 128-bit 隨機 | timestamp + random（lexicographically sortable） |
| 排序 | 不可排序 | 可按創建時間排序 |
| 用途 | 通用唯一識別碼 | 需要時序排序的識別碼（如事件 ID 做時序查詢） |
| 目前 codebase 規範 | ✅ 全域 domain 標準 | ❌ 無現有文件說明在此使用的理由 |

UUID v7 的時序排序特性在某些場景（如 QStash event ordering、Firestore 按 eventId 排序）有技術優勢，
但：
- **沒有 ADR 或代碼注釋說明為何此文件使用 v7**
- workspace 事件的消費者（`WorkspaceDomainEventPublisher`）也沒有說明依賴 eventId 排序
- 全 repo 的 domain event 均使用 v4，此文件的 v7 是**未解釋的例外**

### 實際代碼

```typescript
// modules/workspace/domain/events/workspace.events.ts
import { v7 } from "@infra/uuid";

export function createWorkspaceCreatedEvent(input: { ... }): WorkspaceCreatedEvent {
  return {
    eventId: v7(),    // ← 不一致的 UUID 版本
    type: WORKSPACE_CREATED_EVENT_TYPE,
    ...
  };
}
```

相比之下，其他模組的 domain event（如 `Account._domainEvents.push`）使用的 `eventId`
是從 aggregate 內部的 `uuid()` （v4）生成的。

## Decision

1. **統一使用 UUID v4**（或做出有文件支撐的決策選擇 v7）：
   
   **選項 A：改回 v4（推薦）**
   - 修改 `workspace/domain/events/workspace.events.ts`：
     ```typescript
     import { v4 as uuid } from "@infra/uuid";
     // ...
     eventId: uuid(),
     ```
   - 理由：保持與全 repo 一致，無額外說明負擔。
   
   **選項 B：升級為全局 v7 標準**
   - 若 workspace events 使用 v7 有充分的技術理由（例如 QStash message deduplication 需要時序 ID），
     應在 ADR 中說明，並評估是否要將全 repo 的 `eventId` 生成改為 v7。
   - 僅修改一個文件而不記錄理由，形成了新的不一致。

2. **若選 B，需要補充說明**：
   - 在 `workspace.events.ts` 文件頭部加入注釋：`// eventId uses v7 for time-ordered event replay — see ADR XXXX`
   - 建立新 ADR 說明「workspace domain events 使用 v7 的設計理由」

3. **本 ADR 的預設建議是選項 A**：沒有消費者依賴 eventId 的時序排序，v7 的使用沒有業務需求支撐。

## Consequences

正面（選項 A）：
- domain 層 UUID 使用方式完全一致，`grep "@infra/uuid" modules/` 全部回傳 `v4 as uuid`。
- 沒有額外的文件或規則例外需要維護。

代價（選項 A）：
- 若未來某個 workspace event consumer 確實依賴 v7 的時序特性，需要重新引入 v7（但屆時有業務理由支撐）。

## 關聯 ADR

- **4101** (Inconsistency — UUID Pattern)：建立 `v4 as uuid` 的 domain layer 標準
- **4200** (Inconsistency)：本 ADR 是 ADR 4200 識別的 inconsistency 類別的另一個具體實例
- **2201** (Hidden Coupling)：一旦 workspace aggregate 改為內部收集 domain events，
  此 v7 問題需要同步處理（events 將從 aggregate 內部的 `v7()` 或 `uuid()` 生成）

## Resolution

Replaced `import { v7 } from "@infra/uuid"` with `import { v4 as uuid } from "@infra/uuid"` in `workspace/domain/events/workspace.events.ts`.
All three factory functions (`createWorkspaceCreatedEvent`, `createWorkspaceLifecycleTransitionedEvent`, `createWorkspaceVisibilityChangedEvent`) now use `uuid()` (v4).
Full repo domain-layer UUID strategy is now consistent.
