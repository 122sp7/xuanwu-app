# GAP-03 NotebookLM → Workspace 任務實體化仍是 stub

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-03 |
| 類型 | 業務缺口 |
| 優先級 | P0 |
| 影響範圍 | `notebooklm → workspace` 跨域任務 handoff |
| 狀態 | 🔴 Open |

## 問題描述

`TaskMaterializationWorkflowAdapter.materializeTasks()` 目前：

```typescript
// 直接回傳假結果，未呼叫任何 workspace API
return {
  ok: true,
  taskCount: input.candidates.length,
  workflowHref: undefined,
};
```

- 沒有呼叫 workspace 的任何 published API / server action。
- 沒有建立任何真實 Task aggregate。
- 沒有 correlation tracking。

## 直接影響

- 使用者在 NotebookLM 確認任務候選後，任務永遠不會出現在 workspace task list。
- AI 推薦能力完全無法形成業務閉環。

---

## 20 準則逐項對齊

### 1. AI Operational Scope

**現狀**：此缺口的修補範圍明確：讓 `TaskMaterializationWorkflowAdapter` 呼叫 `workspace` published API（`createTaskAction`）。不需要修改 notebooklm domain 層或 workspace domain 層。  
**補救要求**：修補 PR 只修改 adapter 實作，不修改 `TaskMaterializationWorkflowPort` 介面定義——如需修改 port，需先單獨 PR 並列入 Breaking Change Policy 審查。

---

### 2. Bounded Context

**現狀**：`notebooklm` 負責語意理解與候選生成，`workspace` 負責 task 生命週期管理——邊界劃分正確。`TaskMaterializationWorkflowPort` 正確地抽象了跨邊界 handoff。  
**缺口**：adapter 未真正呼叫 workspace 邊界，跨域協作尚未完成。  
**補救要求**：adapter 只能呼叫 `workspace/index.ts` 公開的 API 或呼叫 workspace server actions，不得直接 import workspace 內部 repository 或 use case。

---

### 3. Ubiquitous Language Governance

**現狀**：`TaskCandidate`（notebooklm 術語）與 workspace 的 `CreateTaskInput` 術語不完全對齊——`candidate.sourceRef` 對應 workspace 的哪個欄位？  
**補救要求**：
- 在 glossary 中定義「候選任務令牌」（`TaskCandidateToken`）為 published language。
- adapter 的轉換層需顯式 mapper（`toCreateTaskInput(candidate: TaskCandidate): CreateTaskInput`），不隱式 spread。

---

### 4. Contract / Schema

**現狀**：`MaterializeTasksInput` 已有型別定義，但 `candidates` 陣列的每個 item 無 Zod runtime 驗證——AI 輸出的 candidates 可能含 null / undefined 欄位。  
**補救要求**：
- 在 adapter 進行 handoff 前，對每個 candidate 執行 `TaskCandidateSchema.parse(c)`。
- 解析失敗的 candidate 單獨記錄錯誤並跳過（不 throw 整批），保留合法候選繼續建立 task。

---

### 5. Breaking Change Policy

**現狀**：`MaterializeTasksInput` 與 `MaterializeTasksResult` 目前由 notebooklm 自身定義，workspace 尚未消費——破壞性變更風險低。  
**補救要求**：一旦 workspace server action 接受 `handoffToken`，任何對 `MaterializeTasksInput` schema 的欄位新增/移除需走版本化審查。

---

### 6. Aggregate Design

**現狀**：workspace `Task` aggregate 的 `create()` 方法已正確設計（工廠方法 + domain event）。  
**缺口**：adapter stub 繞過 aggregate，沒有產生任何 `TaskCreated` domain event，task 的關聯 source（`sourceDocumentId`、`knowledgePageId`）永遠不被記錄在 aggregate state。  
**補救要求**：
- `Task.create()` 命令方法需增加 `sourceRef?: TaskSourceReference` 欄位（AI 生成來源）。
- 不在 adapter 或 use case 直接修改 task 屬性。

---

### 7. State Model / FSM

**現狀**：handoff 流程本身（`pending / processing / succeeded / failed`）無狀態管理。  
**補救要求**：
- 在 `notebooklm/orchestration/` 層定義 `TaskHandoffJob` 狀態機（或使用 `TaskMaterializationJob` aggregate，已存在於 workspace/orchestration）。
- 狀態轉換：`pending → processing → succeeded | failed`，非法轉換 throw。

---

### 8. Consistency / Transaction Strategy

**現狀**：候選確認（notebooklm 側）和 task 建立（workspace 側）是跨域操作，不應放在單一同步交易。  
**補救要求**：
- 實作 saga：notebooklm 發布 `CandidatesConfirmed` event，workspace 消費後建立 tasks。
- 初期可用同步呼叫（server action call），但需定義「若 workspace 建立失敗，notebooklm 如何補償（retry / 通知使用者）」。

---

### 9. Event Ordering / Causality Model

**現狀**：`MaterializeTasksInput` 含 `sourceDocumentId` 但無 `correlationId`——若相同文件觸發多次 materialize，無法去重。  
**補救要求**：
- `MaterializeTasksInput` 增加 `idempotencyKey: string`（例如 `${notebookId}:${sourceDocumentId}:${version}`）。
- workspace 在建立 task 前查詢 `idempotencyKey` 是否已存在，存在則回傳已建立的 task ID。

---

### 10. Failure Strategy

**現狀**：stub 永遠回傳 `{ ok: true }`，不存在失敗路徑——但真實呼叫 workspace API 後必定面對網路失敗、限速、逾時。  
**補救要求**：
- `materializeTasks()` 對 workspace API 呼叫加 retry（最多 3 次，指數退避）。
- 超過 retry 上限：寫入 `materialization_failures` collection，並回傳 `{ ok: false, error: "WORKSPACE_API_UNAVAILABLE" }`。
- 消費端（`ConfirmCandidatesUseCase`）需處理 `ok: false` 並顯示明確錯誤訊息。

---

### 11. Authorization / Security

**現狀**：`MaterializeTasksInput` 含 `requestedByUserId`，但 adapter 沒有把它傳給 workspace API——workspace 無法驗證操作者是否有權在目標 workspace 建立 task。  
**補救要求**：
- handoff 呼叫必須攜帶 actor session token（或 service token），workspace server action 需驗證 actor 具備 workspace member + task:create 權限。
- 不能以「notebooklm 已驗證」作為隱式授權理由。

---

### 12. Hexagonal Architecture

**現狀**：`TaskMaterializationWorkflowPort` 正確地在 notebooklm orchestration 層定義，adapter 在 `adapters/outbound/` 層，架構符合。  
**缺口**：adapter 實作為 stub，未連接外部系統（workspace API）。  
**補救要求**：adapter 只能透過 HTTP call 或 server action import 呼叫 workspace，不得直接 import `@/modules/workspace/subdomains/task/...` 的任何內部路徑。

---

### 13. Dependency Rule Enforcement

**現狀**：目前 stub adapter 未 import workspace 任何內容，所以暫無違規。  
**補救要求**：填充後，adapter import 路徑只能是：
- `import { createTaskAction } from "@/modules/workspace/adapters/inbound/server-actions/task-actions"` （允許 cross-module server action 引用）
- 絕不 import `@/modules/workspace/subdomains/task/domain/...`

---

### 14. Testability / Specification

**現狀**：`TaskMaterializationWorkflowAdapter` 無任何測試，stub 讓測試無意義。  
**補救要求**：填充後補：
- Happy path：candidates 全部成功建立 tasks，回傳 `{ ok: true, taskCount: n }`。
- Partial failure：workspace API 部分失敗，回傳 `{ ok: false, taskCount: m, error }` + 記錄 failure。
- Idempotency：相同 `idempotencyKey` 重複呼叫不建立重複 task。

---

### 15. Observability

**現狀**：stub 無任何 log；填充後需全鏈路可追蹤。  
**補救要求**：
- 記錄 `{ correlationId, workspaceId, notebookId, sourceDocumentId, candidateCount, successCount, failCount, durationMs }`。
- workspace 建立 task 時帶入 `notebooklm.correlationId` 作為來源追蹤欄位。

---

### 16. ADR / Design Rationale

**現狀**：handoff 方式（同步 server action call vs. 非同步 event + saga）有兩種可行路徑，目前無 ADR 選定。  
**補救要求**：列出：
- Option A：notebooklm adapter 同步呼叫 workspace server action（簡單，強耦合 latency）
- Option B：notebooklm 發布 domain event，workspace saga 消費（解耦，需 event infra）  
選定後記錄，不可跳過。

---

### 17. Minimum Necessary Design / YAGNI Enforcement

**現狀**：`workflowHref` 欄位在 `MaterializeTasksResult` 中存在但永遠為 `undefined`——屬預測性擴充。  
**補救要求**：此 PR 不需要實作 `workflowHref`；如無確定的「handoff 狀態頁」需求，不要填充此欄位，保持 `undefined`。

---

### 18. Single Responsibility / No Redundancy

**現狀**：`workspace/orchestration/domain/entities/TaskMaterializationJob.ts` 與 notebooklm 的 `MaterializeTasksInput` 兩處均持有「materialize 任務的狀態」概念——是否重複建模？  
**補救要求**：
- `TaskMaterializationJob` 是 workspace 側的 job aggregate（追蹤建立進度）。
- notebooklm 的 `MaterializeTasksInput` 是 handoff 命令物件（request token）。
- 兩者職責不重疊，但需在 glossary 明確區分，不得混用名稱。

---

### 19. Design Activation Rules

**現狀**：目前 handoff 需求為單一批次、單向——不需要全套 saga orchestration。  
**補救要求**：先實作同步 server action call + idempotency key（最簡可用），只有在出現非同步排隊需求時再引入 event bus / saga。

---

### 20. Lint / Policy as Code

**現狀**：無靜態規則阻止 adapter 直接 `return { ok: true }` 不呼叫真實服務。  
**補救要求**：
- 建立 PR checklist 規則：任何 outbound adapter 實作不得有 `// TODO: replace` comment 進入主線。
- 考慮在 CI 加 grep check：`grep -rn "TODO: replace with real" src/modules/` 失敗管道。

---

## 修補路徑（最小必要步驟）

1. 撰寫 ADR（Rule 16）選定 handoff 方式。
2. 在 `MaterializeTasksInput` 補 `idempotencyKey`（Rule 9）。
3. 補 `TaskCandidateSchema` Zod parse（Rule 4）。
4. 補 `toCreateTaskInput()` mapper（Rule 3）。
5. 填充 adapter：呼叫 workspace `createTaskAction` + retry + failure 記錄（Rule 10, 11）。
6. 補 workspace `Task` aggregate 的 `sourceRef` 欄位（Rule 6）。
7. 補 `materializeTasks` 結構化 log（Rule 15）。
8. 補 unit tests（Rule 14）。
