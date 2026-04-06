# Domain Events — workspace-flow

## 發出事件

### Task 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.task_created` | Task 建立 | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task 狀態變更 | `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task 指派負責人 | `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task 由 KnowledgeToWorkflowMaterializer 物化 | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue 開啟 | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue 狀態變更 | `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 解決 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 建立 | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice 狀態變更 | `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 標記已付款 | `invoiceId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | KnowledgeToWorkflowMaterializer 建立 MaterializedTask 與 Invoice |

## 消費 workspace-flow 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | 通知被指派者 |
| `workspace-audit` | 所有狀態變更事件 | 記錄稽核軌跡 |
