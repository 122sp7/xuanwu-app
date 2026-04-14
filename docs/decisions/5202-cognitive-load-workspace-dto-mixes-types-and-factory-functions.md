# 5202 Cognitive Load — `workspace-interfaces.dto.ts` 混合型別 export 與 factory function export

- Status: Accepted
- Date: 2026-04-14
- Category: Complexity Smells > Cognitive Load

## Context

`modules/workspace/application/dto/workspace-interfaces.dto.ts` 是
workspace application 層的 DTO（Data Transfer Object）匯聚文件，
設計目的是「讓 interfaces 層從這裡 import workspace 所需的 DTO 型別，不直接依賴 domain 內部」。

然而，此文件目前同時 re-export **型別（types）** 和 **行為（factory functions）**：

```typescript
// workspace/application/dto/workspace-interfaces.dto.ts

// ✅ 型別 re-exports（正確的 DTO 職責）
export type {
  Address, WorkspaceEntity, WorkspaceLifecycleState, WorkspaceVisibility, ...
} from "../../domain/aggregates/Workspace";

// ✅ Value-object helpers（邊界性：values 而非 pure types，但可接受）
export {
  createAddress, createWorkspaceLifecycleState, createWorkspaceName, ...
} from "../../domain/value-objects";

// ✅ Domain event types（正確）
export type {
  WorkspaceCreatedEvent, WorkspaceDomainEvent, ...
} from "../../domain/events/workspace.events";

// ⚠️ Domain event factory functions（行為，不是 DTO）
export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,               // ← factory function
  createWorkspaceLifecycleTransitionedEvent, // ← factory function
  createWorkspaceVisibilityChangedEvent,     // ← factory function
} from "../../domain/events/workspace.events";

// ✅ Port types（正確）
export type { WorkspaceCommandPort } from "../../domain/ports/...";
```

### 問題分析

#### DTO 的語意

DTO（Data Transfer Object）的核心語意是：
> **資料形狀的合約（data shape contract）**——描述在層次邊界傳遞的資料結構。

DTO 文件應只包含：
- Type aliases、interfaces
- Plain data constructors（如 `createAddress`，接受 raw input 回傳 VO 型別）

DTO 文件**不應包含**：
- Domain event factory functions（這些是聚合根的 private concern）
- Event type constants（`WORKSPACE_CREATED_EVENT_TYPE`）——這些是 domain event discriminant，不是 DTO

#### 認知負荷的具體表現

1. **開發者讀到 `workspace-interfaces.dto.ts` 的第一反應**：
   「這是 DTO 文件，應該只有型別。但為什麼有 `createWorkspaceCreatedEvent()` 這個函式？
   它在做什麼？誰在用它？」
   → 需要額外閱讀才能理解文件的完整職責範圍。

2. **職責不明確造成的 placement ambiguity**：
   當開發者需要新增 workspace domain event 相關邏輯時，不清楚是放在：
   - `workspace/domain/events/workspace.events.ts`（定義事件）
   - `workspace/application/dto/workspace-interfaces.dto.ts`（有 re-export，也有 factory？）
   - use-case 文件（直接呼叫 factory？）

3. **factory functions 不應從 DTO 文件向外暴露**：
   `createWorkspaceCreatedEvent` 是供聚合根內部（或當前 use-case 層）使用的工具，
   不是需要向 interfaces 層暴露的 DTO 合約。
   DTO 消費者（interfaces layer）只需要 `WorkspaceCreatedEvent` **型別**，不需要 factory function。

4. **與 ADR 2201 的關係**：
   factory functions 被暴露在 DTO 文件，是因為 workspace 的 use-cases 目前
   從 DTO 文件 import factory functions 來手動創建事件（ADR 2201 描述的外部事件創建問題）。
   一旦 ADR 2201 解決後（aggregate 內部收集事件），use-cases 不再需要這些 factory functions，
   DTO 文件的 factory function export 也就失去存在意義。

### 對比：其他模組 DTO 文件

```
modules/notion/subdomains/knowledge/application/dto/index.ts
  → export type { KnowledgePageView, CreatePageInput, ... }  (純型別)

modules/platform/application/dto/index.ts
  → export type { PlatformContextView, PolicyCatalogView, ... } (純型別)

modules/notebooklm/subdomains/source/application/dto/source-dto.ts
  → export type { SourceDocument, AddSourceInput, ... } (純型別)
```

這些 DTO 文件都只包含型別，不包含 factory functions。`workspace-interfaces.dto.ts` 是例外。

## Decision

1. **從 `workspace-interfaces.dto.ts` 移除 factory function re-exports**：
   ```typescript
   // 移除這些 export：
   export {
     WORKSPACE_CREATED_EVENT_TYPE,        // ← event discriminant constant
     WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
     WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
     createWorkspaceCreatedEvent,         // ← event factory function
     createWorkspaceLifecycleTransitionedEvent,
     createWorkspaceVisibilityChangedEvent,
   } from "../../domain/events/workspace.events";
   
   // 保留（type-only import/export）：
   export type {
     WorkspaceCreatedEvent,
     WorkspaceDomainEvent,
     WorkspaceLifecycleTransitionedEvent,
     WorkspaceVisibilityChangedEvent,
   } from "../../domain/events/workspace.events";
   ```

2. **在 ADR 2201 完成後自然消除**：
   一旦 `Workspace` aggregate 改為內部收集事件（ADR 2201），
   use-cases 不再需要 import factory functions，
   `workspace-interfaces.dto.ts` 就可以自然地只保留型別 re-exports。

3. **若有消費者目前依賴 factory function re-exports**：
   追蹤其 import，改為直接從 `../../domain/events/workspace.events` import，
   或在 ADR 2201 解決後確認這些 import 已不再需要。

4. **event discriminant constants（`WORKSPACE_CREATED_EVENT_TYPE` 等）的歸屬**：
   這些常數是 domain 層的 type discriminant，應只在 domain event 相關的型別守衛中使用。
   若 interfaces 層需要在 switch/case 中使用，應透過 `export type { WorkspaceEventType }` 型別守衛，
   而非直接 export 常數（或以 `export type const enum` 替換）。

## Consequences

正面：
- `workspace-interfaces.dto.ts` 的職責清晰：「提供 workspace interface 層所需的 DTO 型別合約」。
- 開發者看到 DTO 文件即知道只含型別，不含行為。
- 與其他模組的 DTO 文件結構對齊，降低跨模組認知切換成本。

代價：
- 若 `workspace-interfaces.dto.ts` 的 factory function export 有直接消費者（目前調查結果顯示主要消費者是 lifecycle use-cases），需要更新其 import 路徑後才能移除。
- 此更改與 ADR 2201 有依賴關係：建議一起實施。

## 關聯 ADR

- **2201** (Hidden Coupling)：factory function 在 DTO 中的根本原因是 workspace aggregate 未內部收集事件
- **4200** (Inconsistency)：DTO 文件命名和職責的不一致
- **5200** (Cognitive Load)：workspace-interfaces.dto.ts 的混合職責是更大 cognitive load 問題的一部分
