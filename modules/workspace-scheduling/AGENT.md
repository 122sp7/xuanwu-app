# AGENT.md — modules/workspace-scheduling

## 模組定位

`modules/workspace-scheduling` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區排程、日曆事件與截止日期管理。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `ScheduleEvent`（不是 Event、Meeting、CalendarItem）
- `Deadline`（不是 DueDate、ExpireDate）
- `Milestone`（不是 Target、Goal）
- `TimeSlot`（不是 Slot、Block、Period）
- `Calendar`（不是 Schedule、Planner）

## 邊界規則

### ✅ 允許

```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { ScheduleEventDTO, DeadlineDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止

```typescript
import { ScheduleEvent } from "@/modules/workspace-scheduling/domain/...";
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | 排程 tab 展示 |
| `workspace-flow/api` | API 呼叫 | 從任務同步截止日期 |
| `notification/api` | 事件發布 | 截止日期接近時觸發提醒 |
| `identity/api` | API 呼叫 | 驗證操作者身分 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
