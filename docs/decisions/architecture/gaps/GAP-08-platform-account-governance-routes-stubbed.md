# GAP-08 Account governance routes 仍為 platform-ui-stubs

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-08 |
| 類型 | 業務缺口 |
| 優先級 | P1 |
| 影響範圍 | `/organization` `/members` `/teams` `/permissions` `/workspaces` `/daily` `/schedule` `/schedule/dispatcher` `/audit` `/dashboard` |
| 狀態 | 🔴 Open |

## 現況證據

- `AccountRouteDispatcher.tsx` 將上述 route 全數導向 `platform-ui-stubs.tsx` screen exports。
- `platform-ui-stubs.tsx` 檔頭明示「remaining stubs」，多數頁面為 static counts / disabled actions。
- shell route catalogs 已完成（`shell-command-catalog.ts`, `shell-navigation-catalog.ts`），但能力頁仍未接入實際 use case。

## 14 architecture criteria mapping

### Proper Domain Segmentation (Bounded Context): defines system boundaries
- account/org governance 正確屬 platform bounded context。
- 缺口在「已宣告路由契約」未對應「可執行能力」。

### Complete Aggregate Design (Aggregate Design): maintains data consistency and invariants
- organization/member/team/permission aggregate 的操作不在頁面上可執行，invariant 僅停留於潛在設計。

### Proper Hexagonal Architecture (Hexagonal Architecture): decouples domain from external dependencies
- 當前頁面停留在 UI stub，未形成完整 interfaces -> application -> domain 路徑。

### Consistent Data Flow & Transaction Strategy (Consistency / Transaction Strategy): ensures correct cross-boundary data movement
- 導航可到達但資料流不可用，造成「路由有、交易無」的不一致體驗。

### Strict Data Contract (Contract / Schema): prevents invalid data from entering the system
- stubs 無 inbound schema，正式落地時需在 server action 邊界以 Zod 嚴格 parse。

### Explicit State Model (State Model / FSM): restricts valid state transitions
- governance flows（邀請、審批、排程調度）未顯式建模狀態轉換，現況僅靜態文案。

### Observability Design (Observability): enables understanding of system behavior and runtime state
- 因未接線，無法追蹤 route-level query latency / failure / action audit。

### Robust Failure Strategy (Failure Strategy): ensures recoverability without system corruption
- 現況沒有失敗路徑設計（只有 disabled UI）。正式能力需定義 retry、衝突處理與補償策略。

### Explicit Authorization & Security Boundaries (Authorization / Security): controls data access and operation scope
- 這些 route 為治理面，必須先於功能落地定義 org-scope 權限矩陣與 actor role gate。

### Testability & Specification (Testability / Specification): ensures behavior is automatically verifiable and continuously constrained
- 需建立 route contract tests（route exists + action availability + authorization matrix）。

### Automated Governance & Static Constraints (Lint / Policy as Code): prevents architectural violations at compile and commit time
- 需加政策：進入 shell 主導航的 route 不得永遠指向 stub screen。

### Design Activation Rules: enables architecture only when real complexity appears, preventing over-engineering
- 先啟用核心治理能力（members/teams/permissions/workspaces），再擴展進階報表。

### Single Responsibility & No Redundancy Principle (Single Responsibility / No Redundancy): prevents duplicated modeling across layers and avoids architectural bloat
- 避免在每個 route screen 重複定義權限規則；集中於 platform Permission API。

### Minimum Necessary Design Principle (Minimum Necessary Design / YAGNI Enforcement): ensures all abstractions map to existing requirements, not speculative extensions
- 優先交付可用的 CRUD + 權限守門；不預先導入複雜跨組織流程引擎。

## 最小修補路徑

1. 以 route 為單位逐步替換 stubs（members/teams/permissions/workspaces 優先）。
2. 每條 route 都以 server action + auth/permission + Zod 契約接線。
3. daily/schedule/audit/dispatcher 再以事件/查詢模型逐步接入，不一次大改。
4. 建立「main-nav route 不可長期 stub」治理規則。

## Context7 alignment

- `/colinhacks/zod`: route action 嚴格契約。
- `/statelyai/xstate`: 治理流程轉換 guard。
- `/open-telemetry/opentelemetry-js`: route/action traceability。
- `/eslint/eslint`: flat-config custom architectural policy。
