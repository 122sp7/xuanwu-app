# Domain Events — workspace-scheduling

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 建立 | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | 狀態轉換 | `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 完成 | `demandId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | 同步相關 WorkDemand 的排程狀態（可選） |

## 消費 workspace-scheduling 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | 通知相關成員 |
| `workspace-audit` | 所有狀態變更事件 | 記錄排程稽核軌跡 |
