# Ubiquitous Language — workspace-scheduling

> **範圍：** 僅限 `modules/workspace-scheduling/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作需求 | WorkDemand | 一個已排程或待排程的工作請求，含標題、截止日期與優先級 |
| 需求狀態 | DemandStatus | WorkDemand 的生命週期狀態：`draft \| open \| in_progress \| completed` |
| 需求優先級 | DemandPriority | 工作緊急程度：`low \| medium \| high` |
| 日曆控件 | CalendarWidget | 顯示工作需求排程的日曆 UI 元件 |
| 帳戶排程視圖 | AccountSchedulingView | 跨工作區的帳戶級別排程總覽頁面 |

## 狀態標籤（顯示文字）

| 狀態 | 中文標籤 |
|------|---------|
| `draft` | 草稿 |
| `open` | 待處理 |
| `in_progress` | 進行中 |
| `completed` | 已完成 |
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `WorkDemand` | `Demand`, `Request`, `Ticket` |
| `DemandStatus` | `Status`, `WorkStatus` |
