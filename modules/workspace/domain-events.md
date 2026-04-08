# Domain Events — workspace

本文件定義 workspace 的目標 domain event 契約。它描述的是 bounded context 應該公開的事件語言，不宣稱所有事件都已經完全接線完成。

在 workspace 中，Domain Event（領域事件）是事件類別或訊息物件。它不是 UI callback，也不是 repository method；它是 bounded context 對外發布的語言單位。

從 strategic design 角度看，這些事件是 `workspace` bounded context 對整體 Xuanwu domain 其他 bounded context 公開的 published language。

從六邊形架構角度看，事件型別與工廠屬於內核語言；event bus / event store 與實際發布機制屬於外層 adapter 協作。

## Event-Driven Architecture Position

- `workspace` 可以作為一個 hexagonal system 發出 outgoing events，也可能在未來接收 incoming events
- 事件驅動是 bounded context 之間的解耦機制，不代表 aggregate 必須採 event sourcing
- 事件 subscriber / pipeline filter / bus adapter 屬於邊界協作，不應污染 domain event 語言本身

## Ports, Adapters, Drivers, and Projections

- Drivers 先透過 command-side paths 觸發狀態改變，再由 application / adapter 協調發布事件
- 若未來抽出 event publisher abstraction，該 abstraction 是 port；實際 bus / store connector 是 adapter
- 下游 bounded context 或本地 query-side flow 可以用事件更新 projection / read model
- 但 domain event 本身不是 projection；它是發布語言，不是讀取結果

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

## 明確不是目前策略的內容

- 目前 workspace repository 不是 event-sourced repository；aggregate 不是從 event store replay reconstitute
- 目前沒有專屬的 event pipeline / filter chain 作為主要處理模型
- 目前沒有 `workspace` 專屬的 long-running process executive 或 tracker aggregate
