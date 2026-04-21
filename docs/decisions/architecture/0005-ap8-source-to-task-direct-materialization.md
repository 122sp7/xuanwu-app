# ADR 0005 — AP8 Source→Task 直接物化路徑

## Status

Proposed

## Date

2026-04-21

## Context

使用者在 `?tab=Sources` 上傳 `4510250181-AP8_v0-8150.PDF` 後，已依序手動執行：

- `解析文件(Layout Parser)`
- `解析文件(Form Parser)`
- `解析文件(Document OCR)`
- `解析文件(Genkit-AI)`
- `建立RAG索引`
- `重建RAG索引`
- `建立知識頁(Page)`
- `建立資料庫(Database)`

之後前往 `?tab=TaskFormation`，仍無法有效產出 54 個任務。

本次分析確認：

1. **PDF 本身確實包含 54 個可物化明細。**
   - `pdf-reader` 對 `4510250181-AP8_v0-8150.PDF` 回傳 `num_pages = 12`，其中第 2–7 頁的 `page_texts` 已連續出現項次 `10 ... 540`。
   - 第 7 頁明確包含 `540 ... （玖）利潤及雜費`，並同頁出現 `未稅總計81,500,000 / 稅金4,075,001 / 含稅總價85,575,001 TWD`。
   - `table_info` 顯示 P2–P7 為多個 9 欄表格，信心度多落在 `0.33–0.52`，符合「dense PDF、表格切裂、跨頁續接」特徵。

2. **現有程式碼已承認 AP8 是特殊 dense PO 格式。**
   - `fn/src/domain/services/po_extraction.py` 與 `src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.ts` 都有 AP8 / `3RDTW` 專用規則。
   - `fn/src/core/config.py` 明示 AP8 4510250181 應走 OCR 通道，且預期有 54 個明細。

3. **失敗主因不是 PDF 沒被讀到，而是 Task Formation 沒有拿到文件內容。**
   - `WorkspaceTaskFormationSection.tsx` 在 `handleExtract()` 只送出：
     - `sourcePageIds: [selectedSource]`
     - `selectedSource ∈ {"pages","database","research"}`
     - **沒有 `documentId`，也沒有 `sourceText`**
   - `startExtractionAction()` 會走 `createClientTaskFormationUseCases()`，實際使用 `FirebaseCallableTaskCandidateExtractor`。
   - `FirebaseCallableTaskCandidateExtractor.extract()` 在 `sourceText` 為空時，會退化成 `source-id candidates`，本質上只會依 `sourcePageIds` 產生占位候選，而不是 54 個 PO line items。

4. **Sources 頁面的按鈕目前彼此分離，沒有形成「解析結果 → 54 任務」的閉環。**
   - `createPageFromDocumentAction()` 只設定 `shouldCreatePage: true`、`shouldCreateTasks: false`。
   - `createDatabaseFromDocumentAction()` 只建立資料庫名稱，不會把 Form Parser / OCR / Genkit 結果送進 task formation。
   - `建立RAG索引` / `重建RAG索引` 只使用 Layout Parser 產物，也沒有把任務候選回灌到 task formation。
   - `Sources` 下方的 `任務形成` CTA 只導向 `?tab=TaskFormation`，沒有攜帶任何文件上下文。

5. **Context7 驗證的現代化能力與目前缺口一致。**
   - Genkit / Gemini 支援直接將 `application/pdf` 作為 multimodal 輸入，並以 schema 約束結構化輸出。
   - Google Cloud Document AI 文件指出：
     - Layout Parser 適合抽取 text / tables / lists 與 context-aware chunks。
     - Form Parser 適合 generic entities / key-value / checkboxes / tables。
   - 因此對 AP8 這種「跨頁、多列、同一 item 混合價格區與描述區」文件，**Document AI 適合做 parse 與 chunk baseline，但不應被當成 54 個 task 的最終 canonical task list。**

## Decision

採用 **「Source 直達 Task Formation」** 的最小充分路徑，而不是要求使用者先進入 `Pages / Database / Research` 再繞回任務形成。

### 核心決策

1. **Task Formation 必須新增 `document` 來源型別。**
   - `TaskFormation` 入口不能只傳 `pages | database | research` 三個字串。
   - 必須能攜帶 `documentId`（必要）與可解析出的 source payload reference（例如 OCR / structured JSON）。

2. **AP8 的 canonical task source 改為「結構化 line items」，不是 tab 名稱，也不是 RAG chunk。**
   - 優先來源：
     1. 已持久化的 structured PurchaseOrder line items
     2. OCR / dense text
     3. Layout text 作為最後 fallback
   - 目標是讓 `10–540` 每個項次都能被一對一映射為 task candidate。

3. **Page / Database 保持為下游 artifact，不作為 AP8 任務形成的前置條件。**
   - `建立知識頁(Page)` 用於 knowledge canonicalization。
   - `建立資料庫(Database)` 用於欄位檢視與人工編修。
   - 它們都不再被假設為「產出 54 任務」的必要中介。

4. **AP8 任務生成優先採用 deterministic extraction，AI 只做補完，不做 item-count 決定權。**
   - 既然文件已具備穩定的項次 `10–540` 與 `3RDTW` dense pattern，就應先做 deterministic item segmentation。
   - AI / Genkit 可用於：
     - 類別補標（施工作業 / 費用管銷）
     - 描述清理
     - due date / owner / tags 補完
   - AI 不應重新決定 item 是否存在，以避免 54 項被合併、遺漏或抽象化。

### 選項比較

#### Option A — 直接在 Task Formation 讀 Source 文件（推薦）

- 新增 `document` selector / handoff contract。
- 從已解析 source 直接讀 structured line items 或 OCR text。
- 對 AP8 以 deterministic 54-item extraction 物化 tasks。

**優點**
- 最少假設，符合 Occam。
- 不需要繞經 Notion page/database content retrieval。
- 能直接對齊「上傳這份 PDF → 形成 54 任務」的使用者目標。

**缺點**
- Task Formation contract 要從「tab 名稱」升級為「具體 source reference」。

#### Option B — 先建立 Page / Database，再由 Task Formation 反查內容

- 維持現有 selector 模型，但在選 `pages` / `database` 後，再額外查回真正內容。

**優點**
- 表面上沿用現有 UI。

**缺點**
- 增加一次反查與內容同步假設。
- `database` 與 `page` 都不是 AP8 54 items 的天然 canonical source。
- 會把已存在於 source 的責任又複製到 notion/workspace，增加語意漂移風險。

#### Option C — 完全交給 Genkit / RAG 從頁面摘要生成任務

- 由 AI 根據 page/database/research summary 自由生成任務。

**優點**
- UI 最省事。

**缺點**
- 無法保證 54 個項次完整保留。
- 對 AP8 這種具固定 item cardinality 的文件，風險最高。

### 採納結論

選擇 **Option A** 作為後續實作方向：

- `Source` 是 AP8 的最短 canonical seam。
- `Task Formation` 要吃到 `documentId + structured payload reference`。
- `Page / Database / Research` 保持為可選下游，不再承擔 54-item completeness 的責任。

## Consequences

### 正面

- 任務形成會從「占位候選」升級為「可驗證的 54 筆 line-item candidates」。
- AP8 類型文件可維持 deterministic completeness，避免 AI 摘要造成的遺漏。
- `Layout Parser / Form Parser / OCR / Genkit` 的角色分工更清楚：
  - Layout Parser：chunk / retrieval baseline
  - Form Parser：generic fields / table assist
  - OCR / structured extraction：AP8 canonical task source
  - Genkit：schema validation 與補強，不主導 item cardinality

### 負面

- 需要修改 task formation 的 source contract 與 UI selector。
- 需要把 source side 的 structured extraction 結果定義為可重用 published payload，而不是只存在暫存 JSON。

### 中性

- `Pages / Database` 仍然有價值，但價值回到知識承載與人工檢視，而不是任務 completeness。
- 若未來遇到非 AP8 文件，仍可走不同 `structuredType` 路由，不必把所有文件都綁成 purchase-order flow。

## References

- `pdf-reader` output for `/home/runner/work/xuanwu-app/xuanwu-app/4510250181-AP8_v0-8150.PDF`
- `/home/runner/work/xuanwu-app/xuanwu-app/src/modules/workspace/adapters/inbound/react/WorkspaceTaskFormationSection.tsx`
- `/home/runner/work/xuanwu-app/xuanwu-app/src/modules/workspace/adapters/outbound/firebase-composition.ts`
- `/home/runner/work/xuanwu-app/xuanwu-app/src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.ts`
- `/home/runner/work/xuanwu-app/xuanwu-app/src/modules/notebooklm/adapters/inbound/react/NotebooklmSourcesSection.tsx`
- `/home/runner/work/xuanwu-app/xuanwu-app/src/modules/notebooklm/adapters/inbound/server-actions/document-actions.ts`
- `/home/runner/work/xuanwu-app/xuanwu-app/fn/src/domain/services/po_extraction.py`
- `/home/runner/work/xuanwu-app/xuanwu-app/fn/src/core/config.py`
- Context7: `/websites/genkit_dev_js` — PDF document understanding / structured output
- Context7: `/websites/cloud_google_document-ai` — Layout Parser / Form Parser capabilities
