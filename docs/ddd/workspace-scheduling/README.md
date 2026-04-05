# workspace-scheduling — 排程上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/workspace-scheduling/`
> **開發狀態:** 🏗️ Midway

## 定位

`workspace-scheduling` 管理工作區的**工作需求（WorkDemand）排程**。提供日曆視圖、截止日期追蹤與工作需求的生命週期管理。

## 職責

| 能力 | 說明 |
|------|------|
| WorkDemand CRUD | 建立、更新、刪除工作需求 |
| 狀態管理 | WorkDemand 狀態機（draft → open → in_progress → completed） |
| 優先級設定 | WorkDemand 優先級（low / medium / high） |
| 日曆視圖 | 提供日曆控件顯示排程（CalendarWidget） |
| 帳戶排程視圖 | 跨工作區的帳戶級別排程總覽（AccountSchedulingView） |

## 核心概念

- **`WorkDemand`** — 工作需求聚合根（title、status、priority、dueDate）

## 狀態機

```
WorkDemand: draft → open → in_progress → completed
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | WorkDemand 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
