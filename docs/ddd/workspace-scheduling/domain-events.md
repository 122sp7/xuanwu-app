# Domain Events ??workspace-scheduling

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 撱箇? | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | ?????| `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 摰? | `demandId`, `workspaceId`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | ?郊?賊? WorkDemand ??蝔????舫嚗?|

## 瘨祥 workspace-scheduling 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | ??賊?? |
| `workspace-audit` | ??????港?隞?| 閮???蝔賣頠楚 |
