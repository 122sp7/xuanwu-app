# ADR 0005 — AP8 Source→Task 54 項交付契約

## Status

Proposed

## Date

2026-04-21

## Context

目標文件 `4510250181-AP8_v0-8150.PDF` 經 `pdf-reader` 檢視為 12 頁 SAP PO，品項區間為 `10` 到 `540`（步進 10），對應 54 個 line items。

目前實際操作（在 `?tab=Sources` 依序點擊 Layout / Form / OCR / Genkit / 建立索引 / 重建索引 / 建立知識頁 / 建立資料庫）後，仍無法穩定產出 54 任務。根因如下：

1. **Sources 頁操作不會觸發任務形成流程**
   - `createPageFromDocumentAction` 固定傳入 `shouldCreateTasks: false`，只建頁不建任務。
2. **Task Formation 入口沒有帶入文件內容**
   - `WorkspaceTaskFormationSection` 呼叫 `startExtractionAction` 時僅傳 `sourcePageIds: ["pages" | "database" | "research"]`，沒有 `sourceText`。
3. **Extractor 在無內容時會回退為極少候選**
   - `FirebaseCallableTaskCandidateExtractor` 在 `sourceText` 空值時，走 fallback 只回傳 `sourcePageIds` 衍生候選（通常 1 筆），不可能達成 54。
4. **流程有文本但不是品項文本**
   - `ProcessSourceDocumentWorkflowUseCase` 在 `parsedTextSummary` 缺失時退回 `documentTitle`，不是可用的項次內容。

另由 `pdf-reader` 可見此 PDF 的表格抽取信心度分散（約 30%–74%），且 SAP PO 屬「主資料/折扣/小計/描述」多列組合，直接用通用文字摘要很容易遺漏品項。

## Decision

採用「**最小必要、可驗證**」的 54 項交付契約：

1. **任務形成輸入改為文件級內容，不再用來源別名**
   - `TaskFormation` 必須接收實際 document scope（documentId + parsed artifact），不能只傳 `pages/database/research` 字串。
2. **先走規則化 line-item 提取，再走 AI 補洞**
   - 第一階段使用 deterministic 規則抽取（`itemNo + 3RDTW + 小計 + 章節 + 描述`）。
   - 第二階段僅針對規則無法覆蓋的殘缺項，使用 Genkit 結構化輸出補齊。
3. **新增 54 項品質閘門**
   - 以 `minItemNo=10`、`maxItemNo=540`、`step=10` 產生預期集合（54）。
   - 產出前必須檢查 `missingItemNos` / `duplicatedItemNos`；未達標直接標記失敗並回報缺口。
4. **Sources 與 TaskFormation 閉環**
   - 在 Sources 完成解析後，提供「以此文件建立任務」入口，直接把該文件 parsed payload 傳給 task-formation。
   - 避免使用者在不同 tab 重新選來源時遺失上下文。

## Context7 驗證（現代化最佳實務）

- **Google Document AI**：Form Parser 與 OCR/其他處理器應按任務分工；Form Parser v2.0 為推薦品質基線。
- **Genkit**：使用 schema-based structured output，並在輸出端做 schema 驗證；必要時使用 constrained output 提高格式穩定性。

## Consequences

**正面：** 能把「是否達成 54」從主觀體感改為可驗證契約；任務形成來源可追溯到單一文件。  
**負面：** 需要新增一層 document-scoped orchestration 與品質檢查。  
**中性：** AI 角色改為補洞，不再承擔第一層完整抽取責任。

## References

- `4510250181-AP8_v0-8150.PDF`（pdf-reader 檢視）
- `src/modules/notebooklm/adapters/inbound/react/NotebooklmSourcesSection.tsx`
- `src/modules/notebooklm/adapters/inbound/server-actions/document-actions.ts`
- `src/modules/notebooklm/orchestration/ProcessSourceDocumentWorkflowUseCase.ts`
- `src/modules/workspace/adapters/inbound/react/WorkspaceTaskFormationSection.tsx`
- `src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.ts`
- `docs/decisions/ai/0005-sap-po-structured-extraction-strategy.md`
