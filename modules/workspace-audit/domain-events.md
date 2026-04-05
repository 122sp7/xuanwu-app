# Domain Events — workspace-audit

## 發出事件

`workspace-audit` 不發出 DomainEvent。它是事件的**最終消費者（Terminal Sink）**，不產生進一步的業務事件。

## 訂閱事件（消費端）

`workspace-audit` 訂閱所有需要留下稽核軌跡的業務事件：

| 來源 BC | 訂閱事件 | AuditLog.auditEventType |
|---------|---------|------------------------|
| `workspace` | `workspace.created` | `workspace.created` |
| `workspace` | `workspace.member_joined` | `workspace.member_joined` |
| `workspace` | `workspace.archived` | `workspace.archived` |
| `organization` | `organization.member_joined` | `organization.member_joined` |
| `organization` | `organization.member_removed` | `organization.member_removed` |
| `workspace-flow` | `workspace-flow.task_status_changed` | `task.status_changed` |
| `workspace-flow` | `workspace-flow.invoice_paid` | `invoice.paid` |
| `workspace-scheduling` | `workspace-scheduling.demand_status_changed` | `demand.status_changed` |
| `source` | `source.upload_completed` | `document.uploaded` |
| `ai` | `ai.ingestion_completed / failed` | `ingestion.completed / failed` |

## 說明

稽核模組是事件消費的「終點站」。業務 BC 不應依賴稽核模組的狀態，稽核只做記錄，不影響業務流程。
