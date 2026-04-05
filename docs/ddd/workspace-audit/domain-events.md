# Domain Events ??workspace-audit

## ?澆鈭辣

`workspace-audit` 銝??DomainEvent???臭?隞嗥?**?蝯?鞎餉?Terminal Sink嚗?*嚗??Ｙ??脖?甇亦?璆剖?鈭辣??

## 閮鈭辣嚗?鞎餌垢嚗?

`workspace-audit` 閮???閬?銝里?貉?頝∠?璆剖?鈭辣嚗?

| 靘? BC | 閮鈭辣 | AuditLog.auditEventType |
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

## 隤芣?

蝔賣璅∠??臭?隞嗆?鞎餌???暺??平??BC 銝?靘陷蝔賣璅∠?????蝔賣?芸?閮?嚗?敶梢璆剖?瘚???
