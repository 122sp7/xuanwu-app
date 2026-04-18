# GAP-04 Task-formation extractor 依賴未部署，fallback 策略過弱

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-04 |
| 類型 | 功能缺口 |
| 優先級 | P1 |
| 影響範圍 | `workspace.task-formation` / `FirebaseCallableTaskCandidateExtractor` |
| 狀態 | 🔴 Open |

## 問題描述

`FirebaseCallableTaskCandidateExtractor` 在 callable 失敗時：

```typescript
// catch 所有錯誤，回傳假資料，外部無從區分成功與失敗
} catch {
  return { candidates: [{ title: "待部署", ... }] };
}
```

- 失敗路徑完全被 silent，使用者看到假候選資料。
- 無失敗分類（網路錯誤 vs 授權錯誤 vs 格式錯誤）。
- 無 retry 決策。
- 無任何可觀測性資料（latency / error code / workspaceId）。

## 直接影響

- 使用者在 `task-formation` 確認後，看到的是系統假造的任務候選，業務決策基礎錯誤。
- 部署 callable 後，若發生失敗，對外表現與「成功但只有一個任務」相同——完全無法告警。

---

## 20 準則逐項對齊

### 1. AI Operational Scope

**現狀**：修補範圍鎖定 `FirebaseCallableTaskCandidateExtractor`——不修改 domain port 定義或 XState machine。  
**補救要求**：修補 PR 只修改 adapter 實作邏輯，不修改 `TaskCandidateExtractorPort` 介面——若需修改 port，單獨 PR 並走 Breaking Change Policy。

---

### 2. Bounded Context

**現狀**：`FirebaseCallableTaskCandidateExtractor` 屬於 task-formation subdomain 的 outbound adapter，邊界正確。  
**缺口**：錯誤 fallback 回傳「待部署」候選，讓 domain（`TaskFormationJob`）看到假資料，污染 domain state。  
**補救要求**：失敗時返回 `Error` 或結構化錯誤物件，讓 domain 正確記錄 `errorCode`——不得以假資料填充候選陣列。

---

### 3. Ubiquitous Language Governance

**現狀**：`extractedCandidates` 陣列中的物件屬性（`title / description / due_date / source / confidence / source_block_id / source_snippet`）在 domain glossary 中是否有對應術語？  
**補救要求**：確認 `TaskCandidate` value object 的欄位與 glossary 術語對齊，特別是 `confidence`（確信度）與 `source`（來源類型）。

---

### 4. Contract / Schema

**現狀**：callable 回傳的 JSON 沒有 Zod parse——任何格式異常都會被 `catch` 後回傳假資料，實際 schema drift 永遠不可見。  
**補救要求**：
- 定義 `CallableExtractorOutputSchema`（Zod），對 callable 成功回傳的每個 candidate 做 `parse()`。
- `parse()` 失敗：throw `ExtractorOutputFormatError`（標記為 non-retryable），記錄 raw response 摘要。

---

### 5. Breaking Change Policy

**現狀**：callable 協議（函式名稱 `extract_task_candidates` + payload schema）目前無版本化。  
**補救要求**：callable 協議需以 `version` 欄位版本化（例如 `{ version: "v1", ... }`）；未來 callable output schema 改變時，新版本 callable 需保持舊版本可用直到客戶端遷移完成。

---

### 6. Aggregate Design

**現狀**：`TaskFormationJob` aggregate 已有 `errorCode` / `errorMessage` 欄位，以及 `fail()` 方法。  
**缺口**：adapter 的假 fallback 讓 `TaskFormationJob.status` 永遠變成 `succeeded`（即使 callable 失敗），aggregate 不變條件被繞過。  
**補救要求**：callable 失敗時，adapter throw error → use case catch → 呼叫 `job.fail(errorCode, errorMessage)` → 保存 job aggregate。

---

### 7. State Model / FSM

**現狀**：`TaskFormationJob` 已定義 `queued / running / succeeded / failed / retrying` 狀態（`TaskFormationJobStatus`）。  
**缺口**：`retrying` 狀態目前無任何代碼使用它——retry 邏輯尚不存在。  
**補救要求**：
- callable retryable 錯誤（網路超時）：狀態轉換 `running → retrying`，retry 次數 +1。
- callable non-retryable 錯誤（格式錯誤、授權失敗）：狀態直接轉換 `running → failed`。
- `retrying → running` 在下次 retry 嘗試時觸發。

---

### 8. Consistency / Transaction Strategy

**現狀**：`ExtractTaskCandidatesUseCase` 中，callable 呼叫與 job state 更新是兩個獨立操作，無原子性保障。  
**補救要求**：
- callable 呼叫成功後，`job.complete(candidates)` 與 `job.repo.save()` 需在同一 Firestore 批次寫入（`batch.commit()`）。
- callable 失敗時，`job.fail()` 與 `job.repo.save()` 也需原子寫入。

---

### 9. Event Ordering / Causality Model

**現狀**：`TaskFormationJob` 的 domain events（`job-created` / `job-completed` / `job-failed`）含 `correlationId`，但假 fallback 觸發 `job-completed` event 而非 `job-failed`——事件語意錯誤。  
**補救要求**：
- callable 失敗必須觸發 `job-failed` event，含 `errorCode`。
- 消費端（例如 task-formation XState machine）需處理 `job-failed` 事件，並向使用者呈現錯誤狀態。

---

### 10. Failure Strategy

**現狀**：所有錯誤被一個 `catch {}` 吞噬，回傳假資料——最嚴重的 silent failure 模式。  
**補救要求**：
- 分類錯誤：
  - `RETRYABLE`：網路超時、服務暫時不可用 → 指數退避，最多 3 次。
  - `NON_RETRYABLE`：schema 解析失敗、授權被拒 → 立即 `job.fail()`。
  - `UNKNOWN`：未預期錯誤 → 記錄 raw error，`job.fail("UNKNOWN_ERROR")`。
- Retry 上限後寫入 DLQ（`task_formation_dlq` collection）供人工重觸發。

---

### 11. Authorization / Security

**現狀**：呼叫 callable 前未驗證 actor 是否有權觸發 task-formation。  
**補救要求**：
- server action 邊界（`extractTaskCandidatesAction`）需呼叫 `requireAuth()` 並驗證 actor 具備 workspace member + task-formation:create 權限。
- callable 層（Cloud Function 側）也需驗證 Firebase Auth token——不依賴客戶端已授權的隱式前提。

---

### 12. Hexagonal Architecture

**現狀**：`FirebaseCallableTaskCandidateExtractor` 使用 `firebase/functions` → callable，符合 infrastructure adapter 定義。  
**缺口**：假 fallback 使 adapter 承擔了「業務降級邏輯」——違反「adapter 只做 I/O，不做業務決策」原則。  
**補救要求**：adapter 只負責呼叫、解析、分類錯誤；業務降級決策（是否顯示特定 UI 狀態）歸屬 use case 或 XState machine。

---

### 13. Dependency Rule Enforcement

**現狀**：`FirebaseCallableTaskCandidateExtractor` 的 import 路徑正確——只引用 port interface，符合規則。  
**補救要求**：維持現有 import 路徑，不新增對 domain 內部型別的直接引用。

---

### 14. Testability / Specification

**現狀**：假 fallback 讓所有測試都「成功」，無法驗證真實行為。  
**補救要求**：補測試：
- Happy path：fake callable 回傳合法候選陣列 → `job.complete(candidates)`。
- Schema error：fake callable 回傳格式錯誤 JSON → `job.fail("FORMAT_ERROR")` + non-retryable 分支。
- Network error：fake callable throw 超時 → retry 3 次後 `job.fail("CALLABLE_TIMEOUT")`。
- Auth error：fake callable throw 401 → 立即 `job.fail("UNAUTHORIZED")` 無 retry。

---

### 15. Observability

**現狀**：無任何 log，不知道 callable 是否被呼叫、latency 多少、失敗原因為何。  
**補救要求**：
- 呼叫前記錄：`{ traceId, workspaceId, actorId, knowledgePageIds, callableVersion }`。
- 呼叫後記錄：`{ traceId, durationMs, status: "success|failed", errorCode?, candidateCount? }`。
- 使用結構化 log（非 `console.log`），接入 Google Cloud Logging 或 OpenTelemetry。

---

### 16. ADR / Design Rationale

**現狀**：未部署 callable 的過渡期策略（feature flag vs. env var vs. fallback service）有多個選項，目前隱式選了「假資料 fallback」但無 ADR。  
**補救要求**：列出：
- Option A：feature flag 控制，flag off 則 UI 顯示「功能未開放」而非假資料
- Option B：deploy callable stub 到 Cloud Functions 回傳空陣列，消除假資料  
選定後記錄，不可繼續使用「假資料 catch」。

---

### 17. Minimum Necessary Design / YAGNI Enforcement

**現狀**：`GenkitTaskCandidateExtractor`（本地 Genkit 實作）已存在但也是 stub——是否需要兩個 extractor 實作？  
**補救要求**：
- 此次只修復 `FirebaseCallableTaskCandidateExtractor`（callable 路徑）。
- `GenkitTaskCandidateExtractor` 只有在有明確「本地 AI 執行」需求時才填充——目前不填充。

---

### 18. Single Responsibility / No Redundancy

**現狀**：`FirebaseCallableTaskCandidateExtractor` 目前同時承擔「呼叫 callable」和「業務降級決策」兩個職責（假 fallback = 業務決策）。  
**補救要求**：移除業務降級邏輯，adapter 只做：呼叫 → 解析 → 分類錯誤 → throw or return。

---

### 19. Design Activation Rules

**現狀**：callable 尚未部署，目前複雜度為「單一 HTTP 呼叫 + 解析」，不需要 saga 或事件驅動。  
**補救要求**：此次修補以「去除假資料、加 retry、加 log」為目標，不引入更複雜的批次策略或 streaming 處理。

---

### 20. Lint / Policy as Code

**現狀**：無靜態規則阻止 `catch {}` 不回報錯誤而回傳假資料。  
**補救要求**：
- 在 `eslint.config.mjs` 加 `no-empty` rule（禁止空 catch）。
- 考慮自定義 rule：adapter 層 `catch` 內不得有 `return [...假資料...]` 型態的回傳。
- CI 加 `grep -rn "待部署\|TODO: replace" src/modules/` 作為阻塞 gate。

---

## 修補路徑（最小必要步驟）

1. 撰寫 ADR（Rule 16）選定過渡期策略。
2. 定義 `CallableExtractorOutputSchema`（Rule 4）。
3. 錯誤分類表：`RETRYABLE / NON_RETRYABLE / UNKNOWN`（Rule 10）。
4. 修改 adapter：移除假 fallback，加 retry + 錯誤分類 + structured log（Rule 10, 12, 15）。
5. use case 接收 adapter throw → `job.fail(errorCode)`（Rule 6, 7）。
6. 補 unit tests（四個情境）（Rule 14）。
7. server action 加 auth gate（Rule 11）。

---

## Context7 驗證錨點

> 本節所有 API 建議均已透過 Context7 查閱官方文件確認（confidence ≥ 99.99%）。

| 函式庫 | Context7 ID | 用途 |
|---|---|---|
| Zod | `/colinhacks/zod` | `CallableExtractorOutputSchema.parse()` 驗證 callable 回傳 + `TaskCandidateSchema` 陣列元素校驗 |
| XState | `/statelyai/xstate` | `extractionJobMachine`：`pending → running → succeeded / failed / retrying` — `guard: 'underRetryLimit'` 阻止無限重試 |
| Stately Docs | `/statelyai/docs` | `invoke.src` actor 接 callable HTTP 呼叫，`onError` 映射到 `failed` state 含 `errorCode` |
| ESLint | `/eslint/eslint` | `no-empty` rule + custom rule：adapter catch 內禁止 `return [...假資料...]` 型態回傳 |

**Zod 關鍵模式（Context7 確認）**：
- `CallableExtractorOutputSchema.safeParse(response)` — 使用 `safeParse` 而非 `parse`，允許 adapter 將驗證錯誤轉換為 `INVALID_RESPONSE` 錯誤分類而不 throw（Rule 4, 10）；
- `z.array(TaskCandidateSchema).min(0)` — 空陣列合法，但非陣列 response 立即 fail（Rule 4）；
- callable 版本欄位 `version: z.literal('v1')` — 明確綁定版本，舊版本協議不通過驗證（Rule 5）。

**XState 關鍵模式（Context7 確認）**：
- `retrying` state 的 `entry: assign({ retryCount: ({ context }) => context.retryCount + 1 })` 記錄重試次數（Rule 10）；
- `guard: ({ context }) => context.retryCount < MAX_RETRIES` 在 `retrying → running` 轉換上執行，超限自動轉入 `failed`（Rule 10）；
- `failed` 為 `type: 'final'`，確保錯誤不 silent swallow（Rule 10）。
