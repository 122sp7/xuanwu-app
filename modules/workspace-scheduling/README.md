# workspace-scheduling — Workspace Scheduling Layer

> **開發狀態**：🏗️ Midway — 開發部分完成
> **Domain Type**：Supporting Domain（支援域）

`modules/workspace-scheduling` 負責工作區內的排程與日曆管理，包含事件排程、截止日期管理與時間區間分配。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 排程管理 | 建立、更新、取消工作區排程事件 |
| 日曆視圖 | 提供工作區日曆事件查詢 |
| 截止日期 | 管理任務與知識的截止日期 |
| 時間區間 | 分配工作時間區間與里程碑 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 排程事件 | ScheduleEvent | 工作區中的排程活動（meeting / deadline / milestone） |
| 截止日期 | Deadline | 任務或知識的完成期限 |
| 里程碑 | Milestone | 專案中的重要時間節點 |
| 時間區間 | TimeSlot | 分配給特定工作的時間範圍 |
| 日曆 | Calendar | 工作區排程事件的時序視圖 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `scheduling.event_created` | 排程事件建立時 |
| `scheduling.deadline_approaching` | 截止日期接近時 |
| `scheduling.milestone_reached` | 里程碑達成時 |

---

## 依賴關係

- **上游（依賴）**：`workspace/api`、`identity/api`、`workspace-flow/api`（任務截止日期）
- **下游（被依賴）**：`workspace/api`（排程 tab）、`notification/api`（截止提醒）

---

## 目錄結構

```
modules/workspace-scheduling/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases
├── domain/               # Entities, Repositories
├── infrastructure/       # Firebase 適配器
├── interfaces/           # 日曆 UI 元件
└── index.ts
```
