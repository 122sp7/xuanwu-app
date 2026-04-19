# GAP-06 workspace.members / workspace.quality / workspace.approval / workspace.settings 未接線

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-06 |
| 類型 | 功能缺口 |
| 優先級 | P1 |
| 影響範圍 | `workspace.members` / `workspace.quality` / `workspace.approval` / `workspace.settings` |
| 狀態 | 🔴 Open |

## 現況證據

- `WorkspaceMembersSection.tsx`、`WorkspaceQualitySection.tsx`、`WorkspaceApprovalSection.tsx`、`WorkspaceSettingsSection.tsx` 為靜態/disabled UI。
- `quality-actions.ts`、`approval-actions.ts` 已存在 use case 入口，但 UI 完全未呼叫。
- `workspace` 已有 membership/quality/approval 子域與 use cases，能力未被啟用到導航頁。

## Architecture criteria mapping

### Proper Domain Segmentation (Bounded Context): defines system boundaries
- 邊界正確：membership/quality/approval 屬 workspace bounded context。
- 缺口在 interfaces 層未串接，不是 domain ownership 問題。

### Complete Aggregate Design (Aggregate Design): maintains data consistency and invariants
- aggregate 已定義（member/quality/approval），但前端流程未觸發，導致 invariant 無法在實際操作中生效。

### Proper Hexagonal Architecture (Hexagonal Architecture): decouples domain from external dependencies
- 目前 UI 直接停在 stub，未走 inbound action → use case → repository 路徑。
- 修補需保持 UI 只呼叫 server actions，不直接碰 infrastructure SDK。

### Consistent Data Flow & Transaction Strategy (Consistency / Transaction Strategy): ensures correct cross-boundary data movement
- 目前資料流中斷於 UI；必須恢復 `section -> action -> use case -> repo` 單向流。

### Strict Data Contract (Contract / Schema): prevents invalid data from entering the system
- quality/approval actions已有 Zod，但 members/settings 尚無一致 inbound schema。
- 需補齊 members/settings action schema，統一 unknown input parse。

### Explicit State Model (State Model / FSM): restricts valid state transitions
- quality/approval UI 顯示固定 0，未反映 review/decision 狀態機。
- 必須將 domain state 映射到 UI filter/status，而非硬編碼。

### Observability Design (Observability): enables understanding of system behavior and runtime state
- 目前無載入/操作 trace 欄位（tab、workspaceId、actorId、result）。
- 建議導入 traceId + action outcome 的結構化 log。

### Robust Failure Strategy (Failure Strategy): ensures recoverability without system corruption
- 現況是 silent empty/disabled，不可區分「真無資料」與「呼叫失敗」。
- 需顯式錯誤態（retry/提示）與可觀測失敗碼。

### Explicit Authorization & Security Boundaries (Authorization / Security): controls data access and operation scope
- 接線時必須沿用 GAP-05 的 auth gate（requireAuth + permission check），避免開功能同時擴大風險面。

### Testability & Specification (Testability / Specification): ensures behavior is automatically verifiable and continuously constrained
- 需新增 section→action integration tests（loaded/error/empty/non-empty）與 role-based access 測試。

### Automated Governance & Static Constraints (Lint / Policy as Code): prevents architectural violations at compile and commit time
- 需加 policy 檢查：workspace governance tabs 不可再以 hard-coded `0` 或永久 disabled action 交付。

### Design Activation Rules: enables architecture only when real complexity appears, preventing over-engineering
- 本次僅啟用既有子域能力，不新增新子域/新流程引擎。

### Single Responsibility & No Redundancy Principle (Single Responsibility / No Redundancy): prevents duplicated modeling across layers and avoids architectural bloat
- 避免在 UI 再造「審核狀態模型」；應直接映射 domain snapshot。

### Minimum Necessary Design Principle (Minimum Necessary Design / YAGNI Enforcement): ensures all abstractions map to existing requirements, not speculative extensions
- 先完成 list/create/transition 主鏈路與錯誤態，不預先導入複雜批次審批設計。

## 最小修補路徑

1. 將 Members/Quality/Approval/Settings 改為真實讀取（至少 list）。
2. Quality/Approval section 接 `list*Action` 與 status 映射，不再硬編碼 0。
3. Members/Settings 補 inbound actions + Zod schema + auth gate。
4. 補 observability 欄位與 integration tests。

## Context7 alignment

- `/colinhacks/zod`: 使用 strict object + parse/safeParse 邊界策略。
- `/statelyai/xstate`: 狀態轉換應顯式 guard，避免 UI 任意跳轉。
- `/open-telemetry/opentelemetry-js`: action/screen 流程補 span attributes 與 error status。
- `/eslint/eslint`: 以 flat config custom rule 落實 stub 交付防線。
