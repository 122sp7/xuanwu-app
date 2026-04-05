# Ubiquitous Language — workspace-flow

> **範圍：** 僅限 `modules/workspace-flow/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 任務 | Task | 可追蹤的工作單元，有狀態機與負責人 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 問題追蹤記錄（Bug / 需求問題） |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務發票記錄 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 物化任務 | MaterializedTask | 從 `knowledge.page_approved` 事件自動建立的任務 |
| 來源參照 | sourceReference | 物化任務/發票的來源頁面引用（pageId, causationId） |
| 工作流程物化器 | ContentToWorkflowMaterializer | 監聽 knowledge 事件並建立 Task/Invoice 的 Process Manager |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
