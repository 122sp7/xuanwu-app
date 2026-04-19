# NotebookLM Source Processing Task Flow

## Purpose

這份 feature 文件描述 `notebooklm/source` 內部的單一 use case：

**上傳文件後，使用者可以在同一個 processing dialog 中選擇：**
- 只做解析
- 解析後建立 RAG 索引
- 解析後建立 Knowledge Page
- 解析後建立 Knowledge Page，並進一步送入任務流程

這一層只回答「這個功能做什麼」，不展開跨 context 的完整交接流程。

## Owning Bounded Context

- **Main Domain**: `notebooklm`
- **Subdomain**: `source`
- **Primary use case**: `ProcessSourceDocumentWorkflowUseCase`

## Business Goal

讓使用者在文件上傳完成後，不需要切換多個頁面或重複操作，就能把同一份來源文件推進到下一個需要的消費場景。

## Actor

- 已登入的 workspace 成員

## Main Success Scenario

1. 使用者上傳文件。
2. 系統呼叫文件解析流程，等待 parse 完成。
3. 使用者可選擇是否建立 RAG 索引。
4. 使用者可選擇是否建立 Knowledge Page。
5. 若使用者勾選「建立任務」，系統會：
   - 先建立 Knowledge Page 作為正典內容承接點；
   - 再從解析文字中抽取 task candidates；
   - 最後把候選任務送入 Workspace Flow。
6. UI 回傳每個 step 的明確狀態與下一步連結。

## Failure Branches

- parse 失敗：RAG / Page / Task 全部跳過。
- 未驗證 Actor：Page 與 Task 不執行。
- draft page 建立失敗：Task 流程停止，不直接跨過 notion 邊界寫入 workspace。
- task extraction 成功但沒有候選項：標記成功，但 `taskCount = 0`。

## Boundary Rules

- `notebooklm/source` **只負責 orchestration**，不直接寫入 workspace repositories。
- 任務流程只能透過 `TaskMaterializationWorkflowPort` 進行。
- `source` 內部只處理 parse / reindex / page handoff / task handoff 的流程狀態，不持有 workflow domain rule。
- 建立任務時，**Knowledge Page 是必要的中介正典載體**；不允許跳過正典內容直接從來源文件去改寫 workspace 任務資料。

## Public User-Facing Output

執行完成後，summary 會回傳：

- parse 狀態
- rag 狀態
- page 狀態
- task 狀態
- `pageHref`
- `workflowHref`
- `taskCount`
- `pageCount`

## Implementation Notes

目前對應的實作重點如下：

- dialog 決策 UI：processing dialog 增加 `shouldCreateTasks`
- application orchestration：`ProcessSourceDocumentWorkflowUseCase`
- task handoff port：`TaskMaterializationWorkflowPort`
- adapter 實作：`TaskMaterializationWorkflowAdapter`

## Guardrails

- 不把 task domain rule 放回 `notebooklm`。
- 不讓 UI 直接呼叫 workspace repository。
- 不讓 notebooklm 直接擁有 canonical task model。
- 不把「建立任務」做成第二條平行且不經 Knowledge Page 的流程。

## Summary

這個 feature 的核心不是「直接建任務」，而是把**同一份 source document**安全地推進到多個下游消費能力，同時維持 `notebooklm → notion / workspace` 的邊界清楚。