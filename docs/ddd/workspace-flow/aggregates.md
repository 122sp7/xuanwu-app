# Aggregates ??workspace-flow

## ???對?Task

### ?瑁痊
?航蕭頩斤?撌乩??桀?嚗恣???渡?隞餃???望??????

### ??望????
```
draft ????in_progress ????qa ????acceptance ????accepted ????archived
```

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | Task 銝駁 |
| `workspaceId` | `string` | ?撅砍極雿? |
| `title` | `string` | 隞餃?璅? |
| `status` | `TaskStatus` | ?嗅????|
| `assigneeId` | `string \| null` | 鞎痊鈭箏董??ID |
| `dueDate` | `string \| null` | ?芣迫?交? ISO 8601 |
| `sourceReference` | `SourceReference \| null` | ?拙?靘?嚗ageId, causationId嚗?|
| `currentUserId` | `string` | ?嗅?????ID |

---

## ???對?Issue

### ??望????
```
open ????investigating ????fixing ????retest ????resolved ????closed
```

### ?撅祆?

| 撅祆?| 隤芣? |
|------|------|
| `id`, `workspaceId`, `title` | ?箸撅祆?|
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` ?湧?蝔漲 |
| `reporterId` | ?勗??董??ID |
| `assigneeId` | 鞎痊鈭箏董??ID嚗?賂? |

---

## ???對?Invoice

### ??望????
```
draft ????submitted ????finance_review ????approved ????paid ????closed
```

### ?撅祆?

| 撅祆?| 隤芣? |
|------|------|
| `id`, `workspaceId` | ?箸撅祆?|
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`嚗?閮?"TWD"嚗?|
| `sourceReference` | ?拙?靘?嚗?賂? |

---

## ?潛隞?

| ?潛隞?| 隤芣? |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 隞 | 隤芣? |
|------|------|
| `TaskRepository` | Task CRUD + ??閰?|
| `IssueRepository` | Issue CRUD + ??閰?|
| `InvoiceRepository` | Invoice CRUD + ??閰?|

---

## Domain Services

| ?? | 隤芣? |
|------|------|
| `ContentToWorkflowMaterializer` | Process Manager嚗???`knowledge.page_approved`嚗遣蝡?MaterializedTask ??Invoice |
