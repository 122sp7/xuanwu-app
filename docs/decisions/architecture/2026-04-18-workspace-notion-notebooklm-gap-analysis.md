# 2026-04-18 Workspace / Notion / NotebookLM 功能缺口與業務缺口盤點

## 背景

本文件以 `npm run repomix:skill` 掃描結果為起點，並交叉檢視目前 `workspace` / `notion` / `notebooklm` 的實作，整理「功能缺口 / 業務缺口」與可落地修補方向。

## 分析範圍（本次要求）

### Workspace Tabs

- `workspace.overview` / `Overview` / 首頁
- `workspace.daily` / `Daily` / 每日
- `workspace.schedule` / `Schedule` / 排程
- `workspace.audit` / `Audit` / 日誌
- `workspace.files` / `Files` / 檔案
- `workspace.members` / `Members` / 成員
- `workspace.settings` / `WorkspaceSettings` / 設定
- `workspace.task-formation` / `TaskFormation` / 任務形成
- `workspace.tasks` / `Tasks` / 任務
- `workspace.quality` / `Quality` / 質檢
- `workspace.approval` / `Approval` / 驗收
- `workspace.settlement` / `Settlement` / 結算
- `workspace.issues` / `Issues` / 問題單

### Notion Tabs

- `notion.knowledge` / `Knowledge` / 知識
- `notion.pages` / `Pages` / 頁面
- `notion.database` / `Database` / 資料庫
- `notion.templates` / `Templates` / 範本

### NotebookLM Tabs

- `notebooklm.notebook` / `Notebook` / RAG 查詢
- `notebooklm.ai-chat` / `AiChat` / AI 對話
- `notebooklm.sources` / `Sources` / 來源文件
- `notebooklm.research` / `Research` / 研究摘要

### Platform Route Titles

- `/organization`、`/members`、`/teams`、`/permissions`、`/workspaces`
- `/daily`、`/schedule`、`/schedule/dispatcher`、`/audit`
- `/workspace`、`/dashboard`

## 缺口總覽

### 優先級定義

| 等級 | 定義 |
|---|---|
| P0 | 直接影響主流程可用性、跨邊界一致性或安全邊界，需優先修補 |
| P1 | 已有替代路徑但風險持續累積，應安排近期迭代處理 |
| P2 | 不阻塞主流程，但會造成能力不完整或擴展成本上升 |

| Gap ID | 類型 | 優先級 | 描述 |
|---|---|---|---|
| GAP-01 | 功能缺口 | P0 | `workspace.schedule` / `workspace.audit` / `workspace.settlement` 仍為 UI empty-state，未接 use case 與 repository |
| GAP-02 | 業務缺口 | P2 | `notion.templates` 與 notion 子域（template/view/collaboration 等）仍大量 placeholder/stub，缺少可執行業務能力 |
| GAP-03 | 業務缺口 | P0 | `notebooklm` 到 `workspace` 的任務實體化僅 stub，跨邊界交易未真正落地 |
| GAP-04 | 功能缺口 | P1 | `workspace.task-formation` 的 AI extractor 依賴未部署 callable，現行使用 fallback stub，失敗策略與可觀測性不足 |
| GAP-05 | 業務缺口 | P0 | 目前部分 Action 僅做輸入驗證，缺少顯式授權與 actor scope 驗證鏈路 |

---

## GAP-01：Workspace 排程 / 日誌 / 結算仍為展示層

### 證據

- `src/modules/workspace/adapters/inbound/react/WorkspaceScheduleSection.tsx`
- `src/modules/workspace/adapters/inbound/react/WorkspaceAuditSection.tsx`
- `src/modules/workspace/adapters/inbound/react/WorkspaceSettlementSection.tsx`
- 三者皆為 UI empty state 與 disabled CTA，未觸發 application use cases。

### 架構對齊（14 準則）

1. **Proper Domain Segmentation**：將 schedule/audit/settlement 視為各自子域能力，不再由 UI 直出假資料。
2. **Complete Aggregate Design**：補齊 `WorkDemand` / `AuditEntry` / `Invoice` 聚合不變條件與命令入口。
3. **Proper Hexagonal Architecture**：由 `interfaces -> application -> domain <- infrastructure` 串接，UI 不直接碰資料來源。
4. **Consistency / Transaction Strategy**：定義建立里程碑、記錄日誌、結算狀態轉換的一致性交易邊界。
5. **Contract / Schema**：Server Action 邊界用 Zod 驗證輸入與查詢條件。
6. **State Model / FSM**：對結算狀態與排程流程加入明確狀態圖（例如草稿/確認/結算）。
7. **Observability**：操作需記錄 traceId、workspaceId、actorId、event type。
8. **Failure Strategy**：提供重試、補償與錯誤分類（可重試 vs 不可重試）。
9. **Authorization / Security**：每個 action 需校驗 actor 對 workspace 的可操作權限。
10. **Testability / Specification**：建立子域 use case 單元測試與關鍵流程整合測試。
11. **Lint / Policy as Code**：加強禁止 UI 層直存取 repo 的規則檢查。
12. **Design Activation Rules**：僅在流程複雜時啟用 FSM/事件化；簡單查詢不過度設計。
13. **Single Responsibility / No Redundancy**：避免在三個頁籤重複資料模型與狀態判斷。
14. **Minimum Necessary Design / YAGNI**：先交付最小可用 CRUD + 狀態遷移，不先做推測性擴充。

---

## GAP-02：Notion templates 與多子域仍大量 placeholder

### 證據

- `src/modules/notion/adapters/inbound/server-actions/template-actions.ts`（明確標註 stub / TODO）
- `src/modules/notion/subdomains/template/application/use-cases/TemplateUseCases.ts`（TODO）
- `src/modules/notion/subdomains/view/*`、`collaboration/*`、`block/*` 多處 placeholder index 檔
- `src/modules/notion/adapters/outbound/notion-page-stub.ts`（`not yet implemented`）

### 架構對齊（14 準則）

1. **Proper Domain Segmentation**：明確切開 page/block/database/view/template/collaboration 的責任邊界。
2. **Complete Aggregate Design**：每個子域至少有可操作聚合根，不以裸資料結構替代。
3. **Proper Hexagonal Architecture**：以 port + adapter 實作，不讓 React/Action 承擔業務規則。
4. **Consistency / Transaction Strategy**：模板套用到頁面/資料庫時定義原子操作與回滾策略。
5. **Contract / Schema**：模板查詢、建立、套用命令皆以 Zod schema 固定契約。
6. **State Model / FSM**：模板生命週期（draft/published/deprecated）以狀態模型約束。
7. **Observability**：模板建立/套用/失敗要可追蹤（event + log）。
8. **Failure Strategy**：替換 stub 為可錯誤回報與可恢復流程，避免 silent empty array。
9. **Authorization / Security**：模板 scope（workspace/org/global）必須有顯式授權閘道。
10. **Testability / Specification**：對模板 use cases 與 scope 規則提供行為測試。
11. **Lint / Policy as Code**：對 placeholder/TODO 建立治理門檻（禁止進入正式流程）。
12. **Design Activation Rules**：view/collaboration 僅在有確定業務需求時擴張到完整子域。
13. **Single Responsibility / No Redundancy**：避免 page/database/template 重複持有相同建模責任。
14. **Minimum Necessary Design / YAGNI**：先補齊 templates 主鏈路，再逐步擴到 collaboration/view 深水區。

---

## GAP-03：NotebookLM → Workspace 任務實體化仍是 stub

### 證據

- `src/modules/notebooklm/adapters/outbound/TaskMaterializationWorkflowAdapter.ts`
- 目前 `materializeTasks()` 回傳固定 `{ ok: true, taskCount }`，尚未真正呼叫 workspace 公開邊界。

### 架構對齊（14 準則）

1. **Proper Domain Segmentation**：notebooklm 只負責候選與語意；task 建立由 workspace 擁有。
2. **Complete Aggregate Design**：task 建立/關聯來源需由 workspace aggregate enforce invariant。
3. **Proper Hexagonal Architecture**：adapter 應透過 workspace public API / server action port 呼叫，不直連資料庫。
4. **Consistency / Transaction Strategy**：定義跨邊界「候選確認→任務建立」交易與冪等鍵。
5. **Contract / Schema**：固定 candidate payload schema（id/source/confidence/owner scope）。
6. **State Model / FSM**：handoff 流程需有 pending/processing/succeeded/failed 狀態。
7. **Observability**：全鏈路要有 correlationId，能對齊 notebooklm 與 workspace 日誌。
8. **Failure Strategy**：支援重放/重試，避免重複建任務或遺失候選。
9. **Authorization / Security**：跨域呼叫要驗證 actor 是否可在目標 workspace 建任務。
10. **Testability / Specification**：加入跨模組契約測試（consumer/provider contract）。
11. **Lint / Policy as Code**：禁止 notebooklm 直接 import workspace 內部層（僅 index.ts / published API）。
12. **Design Activation Rules**：先做同步 handoff；高量或跨服務再升級事件驅動。
13. **Single Responsibility / No Redundancy**：候選語意與任務聚合不重複建模。
14. **Minimum Necessary Design / YAGNI**：先完成單一路徑 materialize，再擴充批次策略。

---

## GAP-04：Task-formation extractor 依賴未部署，fallback 策略過弱

### 證據

- `src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.ts`
- callable 失敗時固定回傳「待部署」假候選，缺少失敗分類、重試決策與追蹤資訊。

### 架構對齊（14 準則）

1. **Proper Domain Segmentation**：抽取器屬於 task-formation outbound port，不滲透到 domain。
2. **Complete Aggregate Design**：`TaskFormationJob` 需完整記錄失敗原因與重試次數。
3. **Proper Hexagonal Architecture**：以 port 抽換 callable 與本地備援實作。
4. **Consistency / Transaction Strategy**：候選寫入與 job 狀態更新要同交易語意。
5. **Contract / Schema**：對 callable output 作嚴格 schema parse，拒絕半結構資料。
6. **State Model / FSM**：狀態應含 `queued/running/succeeded/failed/retrying`。
7. **Observability**：記錄 callable latency、error code、source_type、workspaceId。
8. **Failure Strategy**：導入退避重試、DLQ 或人工介面重新觸發。
9. **Authorization / Security**：呼叫 callable 前校驗 actor 與 workspace scope。
10. **Testability / Specification**：以 fake callable 覆蓋成功/超時/格式錯誤/權限錯誤。
11. **Lint / Policy as Code**：對「catch 後直接回假資料」加入規範檢查或審核清單。
12. **Design Activation Rules**：未部署階段可保留 fallback，但需受 feature flag 控制。
13. **Single Responsibility / No Redundancy**：UI 不自行判斷 callable 細節，集中在 adapter。
14. **Minimum Necessary Design / YAGNI**：先補錯誤可見性與重試，再引入更重流程編排。

---

## GAP-05：授權邊界尚未完整顯式化

### 證據

- `src/modules/notion/adapters/inbound/server-actions/template-actions.ts`
- 目前僅驗證 `workspaceId/accountId/scope/category` 格式，未見 actor/session 驗證與 permission gate。

### 架構對齊（14 準則）

1. **Proper Domain Segmentation**：授權決策歸屬 iam/platform permission API，不內嵌在 UI。
2. **Complete Aggregate Design**：受保護操作應由聚合命令方法 + actor context 驅動。
3. **Proper Hexagonal Architecture**：action 僅做 input parse + 授權檢查 + use case 呼叫。
4. **Consistency / Transaction Strategy**：授權失敗不可落地任何資料副作用。
5. **Contract / Schema**：命令輸入要包含 actor reference 與 scope token。
6. **State Model / FSM**：授權相關流程狀態至少區分 allowed/denied/expired。
7. **Observability**：記錄 deny reason、resource scope、actorId（可審計）。
8. **Failure Strategy**：授權異常需有統一錯誤碼與可追蹤回復路徑。
9. **Authorization / Security**：所有寫操作強制 permission gate。
10. **Testability / Specification**：建立 permission matrix 測試（角色 × 操作 × scope）。
11. **Lint / Policy as Code**：對 server action 強制 requireAuth/permission call 的靜態規範。
12. **Design Activation Rules**：先套用高風險寫操作，再擴至查詢與衍生能力。
13. **Single Responsibility / No Redundancy**：授權邏輯集中於平台服務，不在各 action 重複實作。
14. **Minimum Necessary Design / YAGNI**：先實作必要最小權限矩陣，不提前抽象過度 ACL。

---

## Context7 最佳解決方案查核（已執行）

> 這些查核直接用於本文件決策：  
> - 讓 `GAP-01/03/05` 優先落在「邊界可執行 + 一致性 + 安全」而非先做 UI 擴張。  
> - 讓 `GAP-02/04` 以「先補可驗證主鏈路，再進階擴展」為原則，避免 placeholder 直接演化成過度設計。

### 1) Repomix（`/yamadashy/repomix`）

- 建議使用非互動模式：`--skill-output` + `--force`，適合 CI 與重現性流程。
- `--skill-generate` 可與 include/ignore/compress 搭配，適合聚焦掃描範圍。
- 本次已採 repo script：`npx repomix --config repomix.config.json --skill-generate xuanwu-skill --skill-output .github/skills/xuanwu-skill --force`。

### 2) DDD + Hexagonal（`/sairyss/domain-driven-hexagon`）

- 聚合根必須是外部唯一入口，跨聚合副作用建議透過 domain event 降耦。
- 模組邊界需維持低耦合，只暴露 public interface，利於後續拆分與演化。
- 強調 YAGNI：架構只在有真實複雜度時啟用，避免過度設計。

## 決策結論

1. 先補 **GAP-01 / GAP-03 / GAP-05**（直接影響工作流可用性、跨域一致性、授權安全）。
2. 以 feature slice 逐步清除 **GAP-02 / GAP-04** 的 placeholder 與弱備援。
3. 每個缺口修補 PR 必須附上：Zod 契約、授權檢查、可觀測性欄位、測試證據。
