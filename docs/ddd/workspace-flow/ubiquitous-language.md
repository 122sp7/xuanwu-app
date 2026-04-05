# Ubiquitous Language ??workspace-flow

> **蝭?嚗?* ?? `modules/workspace-flow/` ??銝??

## 銵?摰儔

| 銵? | ?望? | 摰儔 |
|------|------|------|
| 隞餃? | Task | ?航蕭頩斤?撌乩??桀?嚗??????鞎砌犖 |
| 隞餃????| TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| ?? | Issue | ??餈質馱閮?嚗ug / ?瘙?憿? |
| ?????| IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| ?潛巨 | Invoice | 鞎∪??潛巨閮? |
| ?潛巨???| InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| ?拙?隞餃? | MaterializedTask | 敺?`knowledge.page_approved` 鈭辣?芸?撱箇??遙??|
| 靘?? | sourceReference | ?拙?隞餃?/?潛巨??皞??Ｗ??剁?pageId, causationId嚗?|
| 撌乩?瘚??拙???| ContentToWorkflowMaterializer | ?? knowledge 鈭辣銝血遣蝡?Task/Invoice ??Process Manager |

## 蝳迫?踵?銵?

| 甇?Ⅱ | 蝳迫 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
