# 2201 Hidden Coupling — Workspace aggregate 未在內部收集 Domain Events

- Status: Accepted
- Date: 2026-04-14
- Category: Coupling Smells > Hidden Coupling

## Context

Hexagonal Architecture + DDD 的聚合根設計規範（見 `domain-modeling.instructions.md`）要求：
> 「每次狀態修改必須產生對應的**領域事件**並存入 `_domainEvents` 私有陣列。
>  使用 `pullDomainEvents()` 方法提取並清空待發布事件。」

掃描 repo 中各模組的聚合根，確認以下聚合根已遵循此規範：

| 聚合根 | 模組 | `_domainEvents` 陣列 | `pullDomainEvents()` |
|--------|------|---------------------|---------------------|
| `Account` | platform/account | ✅ `private readonly _domainEvents: AccountDomainEventType[] = []` | ✅ |
| `Organization` | platform/organization | ✅ | ✅ |
| `UserIdentity` | platform/identity | ✅ | ✅ |
| `KnowledgePage` | notion/knowledge | ✅ `private readonly _domainEvents: NotionDomainEvent[] = []` | ✅ |
| `Article` | notion/authoring | ✅ | ✅ |
| `KnowledgeCollection` | notion/knowledge | ✅ | ✅ |
| `EntitlementGrant` | platform/entitlement | ✅ | ✅ |
| **`Workspace`** | **workspace** | **❌ 無 `_domainEvents` 陣列** | **❌ 無** |

`Workspace` 是 workspace 主域的核心聚合根（306 行），包含完整的 lifecycle、visibility、capabilities 管理邏輯，
但**沒有**任何 `_domainEvents` 陣列，也**沒有** `pullDomainEvents()` 方法。

### 事件是如何被創建的（現狀）

`Workspace` 的 domain event factory functions 定義在
`modules/workspace/domain/events/workspace.events.ts`：

```typescript
// workspace/domain/events/workspace.events.ts
export function createWorkspaceCreatedEvent(input: { ... }): WorkspaceCreatedEvent { ... }
export function createWorkspaceLifecycleTransitionedEvent(...): WorkspaceLifecycleTransitionedEvent { ... }
export function createWorkspaceVisibilityChangedEvent(...): WorkspaceVisibilityChangedEvent { ... }
```

這些 factory functions 由 **use-case 層**直接呼叫：

```typescript
// workspace/subdomains/lifecycle/application/use-cases/create-workspace.use-case.ts
import { createWorkspaceCreatedEvent } from "../../domain";
// ...
const event = createWorkspaceCreatedEvent({
  workspaceId: workspace.id,
  accountId: input.accountId,
  // ...
});
await this.eventPublisher.publish(event);
```

Use-case 負責「知道」哪個 aggregate 方法對應哪個 domain event，並在持久化後手動呼叫 factory function。

### 問題分析

#### 隱式耦合（Hidden Coupling）的表現

1. **Use-case 知道太多**：`create-workspace.use-case.ts` 需要同時知道：
   - `Workspace.create()` 會建立 workspace
   - 需要呼叫 `createWorkspaceCreatedEvent(...)` 產生事件
   - 事件的 payload 需要哪些欄位（與 aggregate 內部狀態重複）
   
   這些知識本應封裝在聚合根內部。

2. **狀態與事件的一致性由 use-case 維護**：若未來 `Workspace` 的 `create()` 方法新增欄位（如 `region`），
   開發者需要同時更新：
   - `Workspace.create()` 的簽名
   - `WorkspaceCreatedEvent` 的 payload 型別
   - **use-case 中的 `createWorkspaceCreatedEvent(...)` 呼叫**（隱式耦合點）
   
   若只更新前兩者而遺漏第三點，事件 payload 會靜默地遺漏新欄位——不會有型別錯誤，只有運行時語意錯誤。

3. **跨模組一致性破壞**：
   - `Account.createUser()` → `account._domainEvents.push({...})` → use-case 呼叫 `account.pullDomainEvents()`
   - `Workspace.create()` → use-case 呼叫 `createWorkspaceCreatedEvent(...)` → 直接 publish
   
   兩套完全不同的 event emission 模式，增加新加入開發者的認知負荷。

4. **測試難度**：聚合根單元測試無法驗證「建立 workspace 後應產生 WorkspaceCreatedEvent」，
   因為事件不在 aggregate 內部產生，只有 integration 層才能測試完整事件流。

#### DTO 文件的語意問題（次要）

`workspace/application/dto/workspace-interfaces.dto.ts` re-export 了這些 factory functions：
```typescript
// workspace-interfaces.dto.ts
export {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../domain/events/workspace.events";
```

這是因為 use-case 通過 DTO 文件引用 domain 符號，但 DTO 文件承載 factory functions 而非純型別，
是次要的語意問題（另見 ADR 5202）。

## Decision

1. **`Workspace` 聚合根加入 `_domainEvents` 陣列和 `pullDomainEvents()` 方法**：
   ```typescript
   // Workspace aggregate
   private readonly _domainEvents: WorkspaceDomainEvent[] = [];
   
   public pullDomainEvents(): WorkspaceDomainEvent[] {
     const events = [...this._domainEvents];
     this._domainEvents.length = 0;
     return events;
   }
   ```

2. **`Workspace.create()`、`transitionLifecycle()`、`changeVisibility()` 等命令方法內部產生事件**：
   ```typescript
   public static create(id: string, input: CreateWorkspaceCommand): Workspace {
     const workspace = new Workspace({ /* ... */ });
     workspace._domainEvents.push(createWorkspaceCreatedEvent({
       workspaceId: id,
       accountId: input.accountId,
       accountType: input.accountType,
       name: input.name,
     }));
     return workspace;
   }
   ```

3. **Use-case 改為呼叫 `workspace.pullDomainEvents()`，不再直接呼叫 factory functions**：
   ```typescript
   // use-case
   const workspace = Workspace.create(id, input);
   await this.workspaceRepository.save(workspace);
   const events = workspace.pullDomainEvents();
   await this.eventPublisher.publishAll(events);
   ```

4. **`workspace-interfaces.dto.ts` 移除 factory function re-exports**（見 ADR 5202）：
   factory functions 只應由 aggregate 內部使用，不需要透過 DTO 文件暴露給 use-case。

5. **遷移步驟**：
   - 先在 `Workspace` aggregate 加入 `_domainEvents` 和 `pullDomainEvents()`
   - 在各命令方法內部加入事件 push
   - 更新 lifecycle use-cases 改用 `pullDomainEvents()` 模式
   - 移除 `workspace-interfaces.dto.ts` 中的 factory function re-exports

## Consequences

正面：
- `Workspace` 聚合根可以被純 unit test 驗證：「`Workspace.create()` 應產生 `WorkspaceCreatedEvent`」
- 新增 workspace 欄位時，事件 payload 的更新與聚合根方法的更新在同一位置，不會靜默遺漏。
- workspace 模組的 event emission 模式與 platform、notion 一致，降低認知負荷。

代價：
- `Workspace` aggregate 需要從 `readonly` `_domainEvents` 改為 mutable array（加入 `length = 0` 清空）。
- lifecycle use-cases（`create-workspace`、`update-workspace-settings`）需要重構，移除對 factory functions 的直接呼叫。
- `workspace-interfaces.dto.ts` 的 factory function export 若有外部消費者，需要追蹤並更新其 import 路徑。

## 關聯 ADR

- **0010** (Aggregate Domain Event Emission)：定義聚合根負責收集事件的原則
- **ADR 5202** (Cognitive Load)：`workspace-interfaces.dto.ts` 混合 type 與 factory function 的次要問題
- **2200** (Hidden Coupling)：本 ADR 是隱式耦合在聚合根設計上的具體實例
