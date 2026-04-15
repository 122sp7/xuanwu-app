# 0010 Aggregate Domain Event Emission Pattern

- Status: Accepted
- Date: 2026-04-13

## Context

架構規範要求聚合根負責**收集自己的領域事件**：在業務方法執行後，將事件推入 `private _domainEvents: DomainEvent[]`，由 use-case 在持久化成功後呼叫 `pullDomainEvents()` 提取並發布。

掃描後發現以下兩種違規模式：

### 模式一：真正 class 聚合根，但缺少 pullDomainEvents（2 個）

| 文件 | 問題 |
|------|------|
| `modules/workspace/domain/aggregates/Workspace.ts` | class Workspace 有 `create()`、`update()` 等業務方法，但不含 `_domainEvents` 陣列與 `pullDomainEvents()` |
| `modules/notion/subdomains/knowledge/domain/aggregates/BacklinkIndex.ts` | class BacklinkIndex 有狀態更新方法，但不含 domain event 機制 |

### 模式二：事件在 use-case / 外部工廠組裝，而非在 aggregate 內觸發

`modules/workspace/domain/events/workspace.events.ts` 定義了三個事件：

```typescript
WORKSPACE_CREATED_EVENT_TYPE = "workspace.lifecycle_transitioned"
WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE = "workspace.visibility_changed"
WorkspaceCreatedEvent, WorkspaceLifecycleTransitionedEvent, WorkspaceVisibilityChangedEvent
```

但 `Workspace.create()` 與 `Workspace.update*()` 方法完全不推送這些事件到 `_domainEvents`。

追蹤發現這些事件在 `modules/workspace/subdomains/lifecycle/application/use-cases/create-workspace.use-case.ts` 中由 use-case 手動建立 event 物件再直接發布，繞過了聚合根的 event collection 責任。

### 為什麼這是問題

1. **因果性喪失**：事件與狀態變更分離，use-case 可能在持久化之前發布事件（違反 At-Least-Once 保證）。
2. **可測試性下降**：測試聚合根行為必須同時察看 use-case 外部事件組裝邏輯。
3. **事件遺漏風險**：若使用者呼叫 `workspace.updateSettings()` 而不是 `create-workspace` use-case 的特定路徑，不會觸發事件。
4. **不一致性**：`KnowledgePage`、`OrganizationTeam`、`Subscription` 等聚合根已正確實作 `pullDomainEvents`，但 `Workspace` 沒有，形成混亂的雙重標準。

### 正確範例（已有的實作）

```typescript
// modules/platform/subdomains/organization/domain/aggregates/OrganizationTeam.ts
export class OrganizationTeam {
  private _domainEvents: OrganizationTeamDomainEvent[] = [];

  static create(id: string, input: CreateTeamInput): OrganizationTeam {
    const team = new OrganizationTeam(id, { ... });
    team._domainEvents.push({ type: "platform.organization.team_created", ... });
    return team;
  }

  addMember(memberId: string): void {
    // invariant check ...
    this._members.add(memberId);
    this._domainEvents.push({ type: "platform.team.member-added", ... });
  }

  pullDomainEvents(): OrganizationTeamDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
```

### 正確的 use-case 流程

```typescript
export class CreateWorkspaceUseCase {
  async execute(input: CreateWorkspaceInput): Promise<CommandResult> {
    const workspace = Workspace.create(input);      // aggregate creates event internally
    await this.repo.save(workspace);                // persist first
    const events = workspace.pullDomainEvents();    // extract after persist
    await this.publisher.publishAll(events);        // publish last
    return commandSuccess(workspace.id);
  }
}
```

## Decision

確立以下規則：

1. **所有 class 聚合根必須**實作 `private _domainEvents: DomainEvent[]` 與 `pullDomainEvents(): DomainEvent[]`。
2. **業務方法負責推送事件**：凡有狀態變更的 method（`create`、`rename`、`archive`、`update*`）必須在變更後推送對應事件至 `_domainEvents`。
3. **禁止在 use-case 中手動建立 aggregate 事件物件**：use-case 只能呼叫 `pullDomainEvents()` 提取，不允許直接 `new XxxCreatedEvent(...)`。
4. **持久化後才 pull**：use-case 必須在 `repository.save()` 成功後才呼叫 `pullDomainEvents()`，確保事件與持久化一致。
5. **BacklinkIndex 例外審查**：若 `BacklinkIndex` 屬於查詢輔助結構（non-transactional read index）而非真正的命令聚合根，允許不含 `_domainEvents`，但需移至 `domain/entities/` 並標注為 ReadModel。

### 修復範圍

| 優先 | 聚合根 | 行動 |
|------|-------|------|
| 高 | `Workspace` | 新增 `_domainEvents`、`pullDomainEvents()`，在 `create()` / `updateSettings()` 推送 workspace events |
| 高 | `create-workspace.use-case.ts` | 移除手動事件組裝，改為呼叫 `workspace.pullDomainEvents()` |
| 中 | `BacklinkIndex` | 審查是否應為 ReadModel entity，若是則移出 aggregates/ |

## Consequences

正面影響：

- 領域事件與業務行為成為不可分離的原子操作，持久化與事件發布的順序可由 use-case 統一控制。
- 聚合根單元測試可以直接驗證 `pullDomainEvents()` 的輸出，無需依賴 use-case 流程。

代價與限制：

- `Workspace` 的事件遷移需同步更新 `workspace/subdomains/lifecycle/application/use-cases/` 中的 use-case（移除外部事件組裝邏輯）。
- 需要確認 `create-workspace.use-case.ts` 現有的事件發布路徑不會因遷移造成雙重發布。

## Conflict Resolution

- 若現有 `create-workspace.use-case.ts` 直接 import `WORKSPACE_CREATED_EVENT_TYPE` 來組裝事件，遷移後這些 import 應移除，改由 `workspace.pullDomainEvents()` 提供。
- `workspace.events.ts` 的常數定義（`WORKSPACE_CREATED_EVENT_TYPE` 等）保留不動，改由 aggregate 內部 import 使用。
