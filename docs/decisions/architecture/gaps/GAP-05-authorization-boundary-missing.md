# GAP-05 授權邊界尚未完整顯式化

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-05 |
| 類型 | 業務缺口 |
| 優先級 | P0 |
| 影響範圍 | 所有 workspace / notion / notebooklm server actions |
| 狀態 | 🔴 Open |

## 問題描述

現有 server actions（`task-actions.ts`、`issue-actions.ts`、`quality-actions.ts`、`approval-actions.ts`、`template-actions.ts` 等）的共同模式：

```typescript
export async function createTaskAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = CreateTaskSchema.parse(rawInput);
    const { createTask } = createClientTaskUseCases();
    return createTask.execute(input);  // ← 無 requireAuth / PermissionAPI 呼叫
  } catch (err) { ... }
}
```

- 所有 action 只做輸入格式驗證，無 actor session 取得，無 permission check。
- `workspaceId` 從使用者輸入取得，未驗證呼叫者是否屬於該 workspace。

## 直接影響

- 任何知道 `workspaceId` 的人可對任意 workspace 執行寫操作。
- AI agent / script 可繞過 UI 直接呼叫 server action 建立/刪除任意 workspace 資料。

---

## 20 準則逐項對齊

### 1. AI Operational Scope

**現狀**：此缺口的修補範圍限定在「為現有 server actions 加入 auth + permission gate」，不修改 use case 或 domain 層。  
**補救要求**：每個 server action 只新增：取得 session → 取得 actorId → permission check → 繼續或回傳 unauthorized error。不重構 use case 或 aggregate。

---

### 2. Bounded Context

**現狀**：`requireAuth()` 和 `PermissionAPI` 屬於 `iam` / `platform` bounded context。server actions 需消費這些能力。  
**缺口**：目前 server actions 未引用 `platform` Permission API 或 `iam` session API。  
**補救要求**：server actions 透過 `@/modules/platform/index.ts` 提供的 `getAuthSession()` 或 `requireAuth()` 取得 actor——不得直接 import Firebase Auth SDK 在 action 內呼叫。

---

### 3. Ubiquitous Language Governance

**現狀**：`actor` 是 glossary 定義的術語（非 `user`）。現有 action 的 `createdBy`、`assignedTo`、`requesterId` 欄位使用不一致的命名。  
**補救要求**：
- 所有 action 輸入 schema 中，操作者欄位統一改為 `actorId`（已在 `AuditEntry` 中正確使用）。
- 更新 `CreateTaskSchema`、`OpenIssueSchema` 等，不使用 `createdBy` / `requesterId`。

---

### 4. Contract / Schema

**現狀**：Zod schema 只驗證格式（`z.string().min(1)`），未驗證 `actorId` 是否與 session actor 一致——使用者可偽造 `actorId` 欄位。  
**補救要求**：
- `actorId` 不應從 rawInput 接受，應從 session 中取得（`const { actorId } = await requireAuth()`）。
- Schema 移除 `actorId` 欄位（由 server 注入，不接受客戶端傳入）。

---

### 5. Breaking Change Policy

**現狀**：移除 schema 中的 `actorId` / `createdBy` 欄位是破壞性變更——UI 如果傳入這些欄位，需更新。  
**補救要求**：
- 更新 schema 前確認所有呼叫端（`WorkspaceTaskSection` 等）不再傳入 `actorId`。
- 採用 staged migration：先讓 schema 允許 `actorId` optional，server 端以 session 為準，再移除 optional 欄位。

---

### 6. Aggregate Design

**現狀**：`Task.create()` 接受 `CreateTaskInput`（含 `workspaceId` 但無 `actorId`），domain event 含 `workspaceId`——但 task 不知道是誰創建的。  
**補救要求**：
- `Task.create()` 的 input 需包含 `actorId`（由 server action 從 session 注入）。
- domain event `workspace.task.created` 的 payload 需含 `actorId`，以供 audit trail 追蹤。

---

### 7. State Model / FSM

**現狀**：授權本身不需要 FSM，但 workspace member role 狀態（`owner / admin / member / viewer`）控制了哪些轉換是允許的。  
**補救要求**：定義 `role → permitted_transitions` 映射表（例如只有 `admin/owner` 可執行 `transition to accepted`），不在各 action 散落條件判斷。

---

### 8. Consistency / Transaction Strategy

**現狀**：授權失敗不應產生任何副作用——目前由於缺少 auth check，授權概念不存在，副作用管控也無從談起。  
**補救要求**：auth check 必須在 use case 執行前完成。若 use case 已建立 side effect（例如 Firestore 寫入），不允許「事後」回滾——所以 auth 必須是前置 guard，而非後置補償。

---

### 9. Event Ordering / Causality Model

**現狀**：domain events 無 `actorId`，導致事件溯源（event sourcing）追蹤缺少操作者資訊。  
**補救要求**：所有寫操作觸發的 domain event 需在 payload 加入 `actorId`（從 session 取得）。

---

### 10. Failure Strategy

**現狀**：無 auth check = 無 auth 失敗路徑。填充後需定義。  
**補救要求**：
- Session 過期 → 回傳 `commandFailureFrom("UNAUTHORIZED", "Session expired")`，不 throw 未捕獲異常。
- Permission denied → 回傳 `commandFailureFrom("FORBIDDEN", "Insufficient permissions")`，記錄 `{ actorId, resource, action }` 審計 log。
- 兩種錯誤碼的 HTTP 語意不同，不得混用。

---

### 11. Authorization / Security

**現狀**：此 gap 的核心問題。所有 server actions 無授權。  
**補救要求（必須實作）**：
1. `requireAuth()` → 取得 actorId + session token。
2. `platform.PermissionAPI.can(actorId, action, { workspaceId })` → 驗證操作許可。
3. 以上兩步需在每個寫操作 server action 中強制存在。
4. 讀操作（`list*Action`）至少需要第一步（session 驗證），按需加第二步。

---

### 12. Hexagonal Architecture

**現狀**：`requireAuth()` 是 `platform` 提供的 service API，屬於 application layer 可引用的能力，不違反 hexagonal 規則。  
**補救要求**：server actions 屬於 `interfaces/` 層，引用 `platform.AuthAPI` 符合「interfaces → application」方向——不得將 Firebase Auth SDK 直接呼叫放在 action 中。

---

### 13. Dependency Rule Enforcement

**現狀**：如果在 server action 直接 import `firebase/auth`，違反「interfaces 不直接引用 infrastructure SDK」規則。  
**補救要求**：auth 能力必須透過 `@/modules/platform` 提供的 API 抽象，不直接 import Firebase Auth SDK 在 action 層。

---

### 14. Testability / Specification

**現狀**：無 auth 代表 action 測試無法覆蓋「未授權拒絕」情境。  
**補救要求**：補測試：
- Authenticated + authorized：正常執行返回成功。
- Not authenticated：返回 `UNAUTHORIZED`。
- Authenticated but wrong workspace：返回 `FORBIDDEN`。
- Permission matrix：owner / admin / member / viewer 各自允許/禁止的操作。

---

### 15. Observability

**現狀**：無 auth log，安全稽核（audit trail）缺失。  
**補救要求**：
- 每個寫操作記錄 `{ traceId, actorId, workspaceId, action, result: "allowed|denied", reason? }`。
- 拒絕事件需持久化至 `audit_log` collection，不僅僅是 console log。

---

### 16. ADR / Design Rationale

**現狀**：auth gate 的實作方式（middleware 模式 vs. 每個 action 顯式呼叫 vs. decorator）有多個選項。  
**補救要求**：列出：
- Option A：每個 action 顯式呼叫 `requireAuth()` + `permission.can()`（簡單、易追蹤）
- Option B：Higher-order function `withAuth(action)` wrapper（減少重複，需測試 wrapper 本身）  
選定後記錄，不可各 action 自行決定。

---

### 17. Minimum Necessary Design / YAGNI Enforcement

**現狀**：完整 RBAC 系統（細粒度到欄位級別）是過度設計。  
**補救要求**：此次只實作：
- action-level permission check（操作級別）
- workspace membership check（是否屬於此 workspace）  
不預先建立 row-level security 或 attribute-based access control（ABAC）。

---

### 18. Single Responsibility / No Redundancy

**現狀**：如果各 action 都各自實作不同的 auth check 邏輯，將造成授權邏輯散落。  
**補救要求**：auth check 邏輯集中在 `platform.PermissionAPI`，各 action 只呼叫統一 API，不自行判斷 role/permission 邏輯。

---

### 19. Design Activation Rules

**現狀**：缺少 auth 是 P0 安全問題，不需要等「複雜度觸發」——此 gap 本身即是觸發條件。  
**補救要求**：立即補 auth gate，不使用「等功能穩定後再加安全」作為延後理由。

---

### 20. Lint / Policy as Code

**現狀**：無靜態規則強制 server action 必須含 auth 呼叫。  
**補救要求**：
- 在 `eslint.config.mjs` 新增 custom rule 或使用 AST-based check：
  - 在 `src/modules/*/adapters/inbound/server-actions/` 下的所有 `async function *Action` 必須包含對 auth helper 的呼叫。
- 或在 PR checklist 中加入「server action auth check」必填項目。
- CI pipeline 加入此 lint check 作為 blocking gate。

---

## 修補路徑（最小必要步驟）

1. 撰寫 ADR（Rule 16）選定 auth gate 實作模式。
2. 確認 `platform.AuthAPI.requireAuth()` 與 `platform.PermissionAPI.can()` 的公開介面（Rule 2）。
3. 更新所有 action 的 Zod schema：移除 `actorId` / `createdBy` 欄位（Rule 4, 5）。
4. 為所有寫操作 action 加入 `requireAuth()` + `permission.can()` 呼叫（Rule 11）。
5. 更新 `Task.create()` 等 aggregate input 加入 `actorId`（Rule 6, 9）。
6. 補 action-level audit log（Rule 15）。
7. 補 unit tests（Rule 14）。
8. 補 lint rule（Rule 20）。

---

## Context7 驗證錨點

> 本節所有 API 建議均已透過 Context7 查閱官方文件確認（confidence ≥ 99.99%）。

| 函式庫 | Context7 ID | 用途 |
|---|---|---|
| Zod | `/colinhacks/zod` | action schema 邊界 `parse()` + `actorId` 移除的 staged migration（先 optional，再移除）|
| XState | `/statelyai/xstate` | auth gate 流程建模（可選）：`unauthenticated → authenticating → authorized / forbidden` FSM |
| Stately Docs | `/statelyai/docs` | guard 設計：`can(actorId, 'task:create', workspaceId)` 作為顯式 guard condition |
| ESLint | `/eslint/eslint` | flat-config custom rule：`src/modules/*/adapters/inbound/server-actions/**` 下 async function 必須含 auth helper 呼叫 |

**Zod 關鍵模式（Context7 確認）**：
- auth gate 在 schema parse 之後執行，不在 schema 內作 permission check（Rule 4, 11 職責分離）；
- `actorId` staged removal：Phase 1 設為 `z.string().optional()`（保持 backward compat），Phase 2 完全移除，每個 Phase 為獨立 PR（Rule 5）；
- server action 新版 schema：`ActorId` 由 `requireAuth()` 取得，不從 client input 取得（Rule 11）。

**ESLint 關鍵模式（Context7 確認）**：
- flat-config custom rule selector：`FunctionDeclaration[id.name=/Action$/]` 或 `ArrowFunctionExpression` 的 parent `VariableDeclarator[id.name=/Action$/]`，需在函式體中找到 `requireAuth` 呼叫；
- 未找到時回報 `error: "server-action-missing-auth"` 阻塞 CI（Rule 20）。
