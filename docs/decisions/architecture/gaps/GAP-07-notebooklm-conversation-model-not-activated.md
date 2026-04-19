# GAP-07 notebooklm.ai-chat 未啟用 conversation domain model

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-07 |
| 類型 | 業務缺口 |
| 優先級 | P0 |
| 影響範圍 | `notebooklm.ai-chat`、`subdomains/conversation/*` |
| 狀態 | 🔴 Open |

## 現況證據

- `NotebooklmAiChatSection.tsx` 以 local `useState(messages)` 維持對話，未持久化。
- `notebook-actions.ts` 只呼叫 `ragQueryAction`，未使用 conversation use cases。
- `subdomains/conversation/domain` 與 `application/use-cases` 已存在，但 inbound/outbound adapters 仍 placeholder。

## Architecture criteria mapping

### Proper Domain Segmentation (Bounded Context): defines system boundaries
- notebooklm 已清楚定義 notebook/document/conversation 子域。
- 缺口：AI Chat 直接走 callable，繞過 conversation 子域語意邊界。

### Complete Aggregate Design (Aggregate Design): maintains data consistency and invariants
- Conversation aggregate 提供 start/addMessage 等規則，但 UI 未使用，導致「thread 一致性」無法保證。

### Proper Hexagonal Architecture (Hexagonal Architecture): decouples domain from external dependencies
- 目前 inbound action 直接呼叫 callable（外部依賴），缺少 conversation port 編排。
- 需改為 use case 驅動，callable 僅位於 outbound adapter。

### Consistent Data Flow & Transaction Strategy (Consistency / Transaction Strategy): ensures correct cross-boundary data movement
- 目前資料流：UI -> callable -> UI（短路），沒有 conversation persistence。
- 需調整為：UI -> conversation action -> use case -> repo + rag port。

### Strict Data Contract (Contract / Schema): prevents invalid data from entering the system
- `ragQueryAction` 有 schema，但 conversation message contract 未作入口驗證。
- 需在 conversation actions 補 message/thread schema。

### Explicit State Model (State Model / FSM): restricts valid state transitions
- chat lifecycle（idle/querying/responded/failed）未被明確建模；只靠 isPending + catch。
- 建議以 XState 或等價 FSM 明確限制轉換。

### Observability Design (Observability): enables understanding of system behavior and runtime state
- 缺 traceId、conversationId、query latency、failure classification。
- 需記錄每輪問答 span 與 conversation correlation。

### Robust Failure Strategy (Failure Strategy): ensures recoverability without system corruption
- 目前失敗只顯示 generic 文案，沒有 retry policy / dead-letter / partial recovery。
- 需定義 query timeout、可重試錯誤、不可重試錯誤分流。

### Explicit Authorization & Security Boundaries (Authorization / Security): controls data access and operation scope
- inbound actions 無明確 auth gate；需繼承 GAP-05 要求，避免跨 workspace 問答資料外洩。

### Testability & Specification (Testability / Specification): ensures behavior is automatically verifiable and continuously constrained
- 缺少 conversation use case 與 ai-chat action 的契約測試（message ordering、引用回傳、失敗重試）。

### Automated Governance & Static Constraints (Lint / Policy as Code): prevents architectural violations at compile and commit time
- 需新增規則禁止 ai-chat 路由層直接依賴 callable adapter，強制經 conversation/application。

### Design Activation Rules: enables architecture only when real complexity appears, preventing over-engineering
- conversation 子域已存在且需求真實（thread-based RAG），啟用是必要，不是過度設計。

### Single Responsibility & No Redundancy Principle (Single Responsibility / No Redundancy): prevents duplicated modeling across layers and avoids architectural bloat
- 不應同時維持「UI本地 messages 模型」與「domain conversation 模型」兩套真相來源。

### Minimum Necessary Design Principle (Minimum Necessary Design / YAGNI Enforcement): ensures all abstractions map to existing requirements, not speculative extensions
- 先落地最小閉環：start conversation、append message、record answer/citations；不先做多會話分享等進階功能。

## 最小修補路徑

1. 建立 conversation server actions（start/add/list）。
2. 將 ai-chat 改為呼叫 conversation actions，不再直連 callable。
3. 將 rag query 回傳寫入 conversation message/event。
4. 補 auth + observability + failure taxonomy + tests。

## Context7 alignment

- `/statelyai/xstate`: FSM + guards 作為多步驟 chat lifecycle 基線。
- `/colinhacks/zod`: conversation message 與引用資料 schema 嚴格驗證。
- `/open-telemetry/opentelemetry-js`: 每輪問答 span、error status、attributes。
- `/eslint/eslint`: flat-config 規則禁止 route 直連外部 callable。
