# Domain Events — workspace

本文件定義 workspace 的目標 domain event 契約。它描述的是 bounded context 應該公開的事件語言，不宣稱所有事件都已經完全接線完成。

## Event Base Contract

workspace domain events 應對齊 `modules/shared/domain/events.ts` 的共享基底：

- `eventId`
- `type`
- `aggregateId`
- `occurredAt`

`aggregateId` 在 workspace 事件中一律對應 `workspaceId`。

## Canonical Events

| 事件物件 | Discriminant | 觸發條件 | 關鍵欄位 |
|---|---|---|---|
| `WorkspaceCreatedEvent` | `workspace.created` | 工作區建立完成後 | `workspaceId`, `accountId`, `accountType`, `name` |
| `WorkspaceLifecycleTransitionedEvent` | `workspace.lifecycle_transitioned` | `lifecycleState` 發生改變後 | `workspaceId`, `accountId`, `fromState`, `toState` |
| `WorkspaceVisibilityChangedEvent` | `workspace.visibility_changed` | `visibility` 發生改變後 | `workspaceId`, `accountId`, `fromVisibility`, `toVisibility` |

## Event Factories

workspace module 應提供明確工廠函式來建立事件訊息物件，例如：

- `createWorkspaceCreatedEvent(...)`
- `createWorkspaceLifecycleTransitionedEvent(...)`
- `createWorkspaceVisibilityChangedEvent(...)`

這些工廠屬於 domain event language，不是 React helper，也不應放在 page / component 內。

## Publishing Rules

- 先成功持久化 aggregate，再發布事件
- 事件 payload 只包含下游所需的最小資訊
- 不把 React state、router path、UI label 放進事件語言
- application layer / interface adapter 可以組裝 event publisher，但事件物件本身屬於 domain language

## 明確排除的事件

| 不再作為 workspace 事件的名稱 | 原因 |
|---|---|
| `workspace.archived` | 此 bounded context 的生命週期語言是 `stopped`，不是 `archived` |
| `workspace.member_joined` | 工作區成員清單目前是 read projection；成員真相來源屬於 organization / access language |
| `workspace.member_removed` | 同上 |

## 目前落地策略

- 第一批事件以 `WorkspaceCreatedEvent`、`WorkspaceLifecycleTransitionedEvent`、`WorkspaceVisibilityChangedEvent` 為主
- event publishing 依賴 `modules/shared/api` 的 `PublishDomainEventUseCase` 與 event store / event bus adapters
- 在事件完全接線前，文件仍以此處為 canonical published language
