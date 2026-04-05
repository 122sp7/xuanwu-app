# Domain Events ??workspace-flow

## ?澆鈭辣

### Task 鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `workspace-flow.task_created` | Task 撱箇? | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task ?????| `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task ?晷鞎痊鈭?| `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task ??ContentToWorkflowMaterializer ?拙? | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue ?? | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue ?????| `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 閫?捱 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 撱箇? | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice ?????| `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 璅?撌脖?甈?| `invoiceId`, `workspaceId`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | ContentToWorkflowMaterializer 撱箇? MaterializedTask ??Invoice |

## 瘨祥 workspace-flow 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | ?鋡急?瘣曇?|
| `workspace-audit` | ??????港?隞?| 閮?蝔賣頠楚 |
