# AGENT.md — workspace-scheduling BC

## 模組定位

`workspace-scheduling` 是工作需求排程支援域，管理 WorkDemand 生命週期與日曆視圖。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkDemand` | Demand、Request、Ticket、Requirement |
| `DemandStatus` | Status（單獨使用）、State |
| `DemandPriority` | Priority（單獨使用）、Urgency |
| `CalendarWidget` | Calendar、Scheduler |

## 狀態機（必須遵守）

```
DemandStatus: draft → open → in_progress → completed
DemandPriority: low | medium | high
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 驗證命令

```bash
npm run lint
npm run build
```
