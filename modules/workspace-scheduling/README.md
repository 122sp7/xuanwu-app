# workspace-scheduling — 工作區排程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-scheduling/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-scheduling` 讓知識與流程成果進一步進入時間與容量管理，將工作需求落入日曆、截止與排程視角。它支援團隊把抽象工作轉成可安排的協作負載。

## 主要職責

| 能力 | 說明 |
|---|---|
| 需求排程 | 建立與管理 WorkDemand 的狀態生命週期 |
| 時間視圖 | 提供日曆、截止與安排視角 |
| 容量協調 | 讓工作需求能與流程與工作區情境一起被安排 |

## 與其他 Bounded Context 協作

- `workspace-flow` 可作為排程需求來源。
- `workspace` 提供排程歸屬與成員範圍。

## 核心聚合 / 核心概念

- **`WorkDemand`**
- **`ScheduleWindow`**
- **`CapacityAllocation`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
