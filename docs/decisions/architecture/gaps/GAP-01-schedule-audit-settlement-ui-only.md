# GAP-01 Workspace schedule / audit / settlement 仍為 UI empty-state

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-01 |
| 類型 | 功能缺口 |
| 優先級 | P0 |
| 影響範圍 | `workspace.schedule` / `workspace.audit` / `workspace.settlement` |
| 狀態 | 🔴 Open |

## 問題描述

Domain 層（`WorkDemand` / `AuditEntry` / `Invoice`）、application use cases 及 Firestore repositories 均已存在，但：

1. 三個子域的 `adapters/inbound/index.ts` 全部只有 `export {}`，無 server actions。
2. 對應 React section（`WorkspaceScheduleSection` / `WorkspaceAuditSection` / `WorkspaceSettlementSection`）皆為 UI empty state，未呼叫任何 use case。
3. `TaskLifecycleSaga`（saga 在 application 層已定義）在 comment 中明確說明「Caller responsibility: wire this saga into an event bus」——但 wiring 尚未存在。

## 直接影響

- 排程里程碑、日誌記錄、結算流程對使用者完全不可用。
- Saga 觸發路徑（`task.accepted → createInvoice`）永遠不會執行。

---

## 20 準則逐項對齊

### 1. AI Operational Scope

**現狀**：此缺口限定在「補 server actions + 接 UI + 接 Saga wiring」，不需要新建模組或修改跨域介面定義。  
**補救要求**：修補 PR 只能建立 `adapters/inbound/server-actions/` 檔案並更新 `firebase-composition.ts` 的組裝呼叫，不得超出此範圍。

---

### 2. Bounded Context

**現狀**：`schedule` / `audit` / `settlement` 各為 workspace 子域，邊界明確。`TaskLifecycleSaga` 橫跨 task/issue/settlement，但透過 domain event token 溝通——目前僅缺 wiring，不缺邊界定義。  
**補救要求**：Saga wiring 必須在 `workspace` 自身 infrastructure 層完成，不得在 settlement 子域直接引用 task 子域 repository。

---

### 3. Ubiquitous Language Governance

**現狀**：`WorkDemand`（排程需求）、`AuditEntry`（日誌條目）、`Invoice`（發票/結算單）已定義於 domain glossary。  
**補救要求**：Server action 命名必須沿用上述術語（例如 `createWorkDemandAction`、`recordAuditEntryAction`、`createInvoiceAction`），不得自創「Milestone」「Log」「Bill」等名稱。

---

### 4. Contract / Schema

**現狀**：`CreateWorkDemandInput`、`RecordAuditEntryInput`、`CreateInvoiceInput` 在 domain 層已定義，但 server action 邊界尚無 Zod schema 包裹。  
**補救要求**：每個 server action 的 `rawInput: unknown` 必須在第一行以對應 Zod schema `parse()` 後再傳給 use case，不得直接 spread rawInput。

---

### 5. Breaking Change Policy

**現狀**：三個子域目前尚未公開任何外部 schema；`InvoiceStatus` 的 FSM 如日後更動需版本化。  
**補救要求**：一旦 server actions 公開，`CreateWorkDemandInput` 等 input schema 需加版本 tag（例如 `v1`），未來破壞性變更新增 `v2` 而非直接覆寫。

---

### 6. Aggregate Design

**現狀**：`WorkDemand.create()` / `AuditEntry.record()` / `Invoice.create()` 均已以工廠方法設計，狀態修改透過封裝方法（`assign()` / `transition()`），符合規則。  
**缺口**：`SettlementUseCases.ts` 的 `TransitionInvoiceStatusUseCase` 在 use case 層直接呼叫 `canTransitionInvoiceStatus`，繞過 `Invoice.transition()` 的完整業務路徑，造成 double-validation 重複。  
**補救要求**：use case 只呼叫 `invoice.transition(to)`，由 aggregate 自己 throw 無效轉換。

---

### 7. State Model / FSM

**現狀**：
- `DemandStatus`：`draft | open | in_progress | completed`——無 `canTransition` guard，`assign()` 直接切換到 `open` 未校驗前狀態。
- `AuditEntry`：只能 `record()`，無生命週期轉換。
- `InvoiceStatus`：已有 `canTransitionInvoiceStatus`，但 use case 層繞過 aggregate method 呼叫。

**補救要求**：
- 補 `WorkDemand` 中的前置狀態驗證：`assign()` 只能在 `draft` 狀態執行，否則 throw。
- 非法轉換必須 throw，不得 silent ignore。

---

### 8. Consistency / Transaction Strategy

**現狀**：`TaskLifecycleSaga` 的 `onTaskStatusChanged` → `createInvoice.execute()` 是 saga pattern，符合「跨聚合用 saga」設計。但 saga 尚未與 event bus 接線，導致跨子域副作用不會觸發。  
**補救要求**：
- 在 `firebase-composition.ts` 或獨立 saga-wiring 檔案中，訂閱 task domain events，呼叫 `TaskLifecycleSaga.handle()`。
- 不得改為直接在 `transitionTaskStatusAction` 後同步呼叫 `createInvoice`——必須維持非同步 saga 路徑。

---

### 9. Event Ordering / Causality Model

**現狀**：`WorkDemand`、`AuditEntry`、`Invoice` 的 domain events 均含 `eventId: uuid()`，但無版本號或因果 token（causality token）。`TaskLifecycleSaga` 的 event handler 無冪等保護。  
**補救要求**：
- Saga `handle()` 需記錄已處理的 `eventId`，防止重複觸發。
- 初期可用 Firestore document 作為冪等鍵（`processed_events/{eventId}`），無需引入外部 MQ。

---

### 10. Failure Strategy

**現狀**：use cases 已有 `try/catch → commandFailureFrom(...)` 模式，基本失敗捕獲存在。但：
- `TaskLifecycleSaga.handle()` 無 try/catch——saga 失敗會沉默丟失。
- 無 dead-letter 或 retry 路徑。

**補救要求**：
- `TaskLifecycleSaga.handle()` 加 try/catch，失敗寫入 `saga_failures` collection（含 eventId / error / retry_count）。
- 提供人工重跑介面（admin action 或 Firestore 觸發）。

---

### 11. Authorization / Security

**現狀**：三個子域的 server actions 尚不存在，當前無授權檢查——但等於沒有入口，風險尚未暴露。  
**補救要求**：每個新 server action 必須在 `parse(rawInput)` 之後、`useCase.execute()` 之前，呼叫 `requireAuth()` 取得 session 並校驗 actor 對 workspace 的 `role`，不得依賴上游隱式授權。

---

### 12. Hexagonal Architecture

**現狀**：`WorkDemand` / `AuditEntry` / `Invoice` domain 層無 framework import，`FirestoreDemandRepository` / `FirestoreAuditRepository` / `FirestoreInvoiceRepository` 均在 infrastructure 層，符合規則。  
**缺口**：`SettlementUseCases.ts` import `canTransitionInvoiceStatus`（domain value object 函式），可接受，但同時在 use case 做轉換判斷造成邏輯洩漏（見 Rule 6）。  
**補救要求**：只在 aggregate method 內做業務判斷，use case 移除重複 `canTransition` 呼叫。

---

### 13. Dependency Rule Enforcement

**現狀**：`TaskLifecycleSaga` 直接 import `issue/domain/events` 和 `task/domain/events`——跨子域直接引用 domain 層型別。  
**補救要求**：saga 應依賴 workspace 公開事件型別（在 `workspace/shared/events.ts` 或 `workspace/index.ts` 重新 export），不直接深入 `subdomains/issue/domain/events/`。

---

### 14. Testability / Specification

**現狀**：workspace 模組目前無任何 `.test.ts` 或 `.spec.ts` 檔案。  
**補救要求**：新增 server actions 前，先補：
- `WorkDemand.create()` / `assign()` 的 unit test（含無效狀態轉換的 throw 測試）
- `Invoice.transition()` 的 FSM 正反例 unit test
- `TaskLifecycleSaga.handle()` 的 unit test（mock use cases）

---

### 15. Observability

**現狀**：use cases 無結構化 log（只有 error code string）；domain events 有 `eventId` 但無 `traceId` / `actorId` 跨 event payload。  
**補救要求**：
- Server actions 入口記錄 `{ traceId, actorId, workspaceId, action, input_schema }` 結構化 log。
- Saga 執行記錄 `{ eventId, sagaStep, result, durationMs }`。

---

### 16. ADR / Design Rationale

**現狀**：Saga wiring 方式（event bus vs. use-case hook）有多種可行路徑，目前無 ADR 選定。  
**補救要求**：在實作 saga wiring 前，新增 ADR 列出：
- Option A：Firestore trigger（Cloud Functions）
- Option B：in-process use-case hook（在 server action 後同步呼叫 saga）  
選定後記錄理由，不可跳過直接實作。

---

### 17. Minimum Necessary Design / YAGNI Enforcement

**現狀**：`WorkDemand` 已有 `priority`、`scheduledAt`、`assignedUserId` 等欄位，屬於確定需求。  
**補救要求**：補 server actions 時只暴露「建立 WorkDemand」與「指定負責人」兩個行為，不預先建立「批次排程」「週期性任務」等尚無需求的 actions。

---

### 18. Single Responsibility / No Redundancy

**現狀**：`canTransitionInvoiceStatus` 在 `InvoiceStatus.ts`（domain）與 `SettlementUseCases.ts`（application）兩處被呼叫，造成語意重複。  
**補救要求**：移除 use case 中的 `canTransitionInvoiceStatus` 呼叫，只保留 `invoice.transition(to)` 呼叫（aggregate 內部已 guard）。

---

### 19. Design Activation Rules

**現狀**：排程 / 日誌 / 結算三個功能的業務流程尚為線性單一，不需要 XState machine 或複雜編排。  
**補救要求**：此次補齊以 CRUD + 狀態轉換為基準，不引入 XState / workflow engine——待未來流程出現分支或平行化需求時再評估。

---

### 20. Lint / Policy as Code

**現狀**：無靜態分析規則強制「inbound adapter 必須存在 server action」或「saga 必須有 wiring」。  
**補救要求**：
- 考慮在 `eslint.config.mjs` 的 `restricted-imports` 中加規則：`src/modules/workspace/subdomains/*/adapters/inbound/server-actions` 下的 action 檔必須 import auth helper。
- ADR 評審時一併確定可靜態檢測的 checklist。

---

## 修補路徑（最小必要步驟）

1. 撰寫 ADR（Rule 16）選定 saga wiring 方式。
2. 補 `schedule-actions.ts`、`audit-actions.ts`、`settlement-actions.ts`（Rule 4, 11）。
3. 修 `SettlementUseCases.ts` 移除重複 `canTransition` 呼叫（Rule 6, 18）。
4. 補 `WorkDemand.assign()` 前置狀態 guard（Rule 7）。
5. 補 `TaskLifecycleSaga` try/catch + `saga_failures` 寫入（Rule 10）。
6. 接 saga wiring（Rule 8）。
7. 補 unit tests（Rule 14）。
8. 補 server action 入口結構化 log（Rule 15）。
