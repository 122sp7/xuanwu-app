# 5200 Cognitive Load

- Status: Accepted
- Date: 2026-04-13
- Category: Complexity Smells > Cognitive Load

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

認知負荷（Cognitive Load）指開發者為了理解、修改或新增一個功能，需要同時記住的概念數量。高認知負荷直接降低開發效率，增加出錯機率。

掃描後發現三類高認知負荷問題：

### 問題一：最大路徑深度 13 層（workspace-workflow）

```
modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-task.actions.ts
```

路徑分解：
1. `modules/`
2. `workspace/`
3. `subdomains/`
4. `workspace-workflow/`
5. `interfaces/`
6. `_actions/`
7. `workspace-flow-task.actions.ts`

7 層路徑（全路徑從 repo root 計算為 13 段）。開發者閱讀 import 路徑時需要同時理解：module → subdomain → layer → sub-category → file，認知成本高。

同類深層路徑（全 13 段）：
```
workspace-workflow/infrastructure/repositories/FirebaseTaskRepository.ts
workspace-workflow/infrastructure/repositories/FirebaseIssueRepository.ts
workspace-workflow/infrastructure/repositories/FirebaseInvoiceRepository.ts
workspace-workflow/interfaces/_actions/workspace-flow-task-batch-job.actions.ts
workspace-workflow/interfaces/_actions/workspace-flow-issue.actions.ts
workspace-workflow/interfaces/_actions/workspace-flow-invoice.actions.ts
workspace-workflow/interfaces/queries/workspace-flow.queries.ts
workspace-workflow/interfaces/contracts/workspace-flow.contract.ts
```

### 問題二：platform/application/ 有 8 個子目錄

```
modules/platform/application/
  dtos/
  event-handlers/     ← 見 ADR 4300
  event-mappers/      ← 見 ADR 4300
  handlers/           ← 見 ADR 4300
  queries/
  services/
  use-cases/
```

7 個平行子目錄，開發者需要記住「event-handlers vs handlers vs event-mappers 的區別」，以及「services vs use-cases 的區別」（見 ADR 5100）。

### 問題三：platform/api/ 有 7 個文件（不含子目錄）

```
modules/platform/api/
  index.ts            ← 主入口（153 行）
  contracts.ts        ← 型別合約
  facade.ts           ← Facade 函式
  infrastructure-api.ts ← 基礎設施能力
  service-api.ts      ← 服務能力
  platform-service.ts ← Platform Facade 單例
```

消費者 import 時需要決定：「我需要的東西在 index.ts、contracts.ts、facade.ts、infrastructure-api.ts 還是 service-api.ts？」—— 6 個文件均無法從名稱快速判斷差異，需要逐一查閱。

### 問題四：interfaces/ 同時存在技術層命名和子域命名（見 ADR 4200）

開發者在 notion 模組工作時，`interfaces/knowledge/` 是子域組織；
切換到 workspace 工作時，`interfaces/web/` 是技術渠道組織。
這兩種心智模型需要來回切換，增加認知負荷。

## Decision

1. **控制路徑深度上限為 10 層**（從 repo root 計算）：
   - workspace-workflow 可考慮從 `subdomains/workspace-workflow/` 提升為獨立的 `modules/workspace-workflow/`（如果它已有完整的 domain + application + infrastructure + interfaces 結構）。
   - 或者 workspace-workflow 的 `_actions/` 子目錄合併，減少一層。
2. **platform/application/ 子目錄數量控制在 4 個以內**：
   - `use-cases/` ← 業務行為
   - `queries/` ← CQRS 讀端
   - `dtos/` ← 輸入輸出合約
   - （可選）`event-reactions/` ← 領域事件副作用（明確命名）
   - 合併 services/ 到 use-cases/，移除 event-handlers/、event-mappers/、handlers/（見 ADR 4300）
3. **platform/api/ 文件精簡到 3 個**（見 ADR 3100、5100）：
   - `index.ts` — 能力合約（auth、permission、file）
   - `ui.ts` — UI 元件（需要時）
   - `server.ts` — server-only 能力
4. **interfaces/ 結構選擇規範化**（見 ADR 4200）：
   - 各模組在 `interfaces/interfaces.instructions.md` 中說明使用哪種組織方式，消除開發者的猜測成本。

## Consequences

正面：
- 路徑深度降低後，import 路徑更短，IDE 補全更快，認知成本降低。
- platform/application/ 結構清晰後，新增事件處理器不需要判斷歸屬。

代價：
- workspace-workflow 如果升為獨立 module，需要評估它是否違反「四主域」架構規範（ADR 0002）——可能不升 module，而是合併 _actions/ 子目錄。
- platform/api/ 精簡需要追蹤所有消費者是否依賴 infrastructure-api.ts 或 platform-service.ts 的具體路徑。
