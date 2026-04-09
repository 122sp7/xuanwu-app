
I'll help you create the README for the workspace/scheduling subdomain. First, let me check the reference format from the notebooklm conversation subdomain.

Since I need to examine an existing README to match the format, let me query the project structure and reference file.

Based on the Xuanwu App architecture documented in your instructions, I'll create a structured README for the **workspace/scheduling** subdomain following DDD principles:

```markdown
# Workspace Scheduling Subdomain

## 概述 (Overview)

**Scheduling** 是 **Workspace** 主域的支援子域，負責工作區層級的排程管理——事件、工作流、提醒與時間相關的協調。

| 屬性 | 值 |
|---|---|
| 主域 | workspace |
| 分類 | Generic Subdomain |
| 核心職責 | 排程與時間管理、事件排程執行、提醒與通知協調 |
| 上游依賴 | workspace (parent), platform (notification, background-job) |
| 下游消費者 | workspace-feed, workspace-audit |

## 通用語言 (Ubiquitous Language)

| 術語 | 定義 |
|---|---|
| Schedule | 排程聚合根——時間驅動的動作描述 |
| ScheduledAction | 待執行的動作實體——何時、做什麼、由誰 |
| Recurrence | 重複規則值物件——頻率、週期、終止條件 |
| ScheduleTriggered | 領域事件——排程執行時刻已到 |
| ScheduleCancelled | 領域事件——排程已取消 |

## 聚合根與實體 (Aggregates & Entities)

### Schedule (聚合根)

```
Schedule
├── scheduleId: ScheduleId (PK)
├── workspaceId: WorkspaceId
├── title: ScheduleName
├── description: string (optional)
├── scheduledAction: ScheduledAction (entity)
├── recurrence: Recurrence (value object)
├── status: ScheduleStatus (ACTIVE, PAUSED, COMPLETED, CANCELLED)
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── events: DomainEvent[]
```

## 儲存庫 (Repositories)

- `IScheduleRepository` — 排程聚合根的 CRUD 與查詢
- `IScheduleEventRepository` (optional) — 排程歷史與執行記錄

## 應用服務 (Use Cases)

- `CreateScheduleUseCase` — 新增排程
- `UpdateScheduleUseCase` — 編輯排程
- `CancelScheduleUseCase` — 取消排程
- `ListSchedulesUseCase` — 列表查詢
- `ExecuteScheduledActionUseCase` — 執行排程動作（cron/background-job 呼叫）

## 跨界上下文 (Context Map)

```
Scheduling →[publishes event]→ workspace-feed, workspace-audit
Scheduling ←[subscribes]← platform.notification, platform.background-job
```

## 入口點與邊界 (API Boundary)

詳見 `api/index.ts` 的 Facade 與 DTO 定義。

---

**Last updated**: 2026-03 | **Owner**: workspace team
```
