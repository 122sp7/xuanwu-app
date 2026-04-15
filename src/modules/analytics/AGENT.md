# Analytics Module Agent Guide

## Purpose

`src/modules/analytics` 等價蒸餾 `modules/analytics` 的 read-model 與指標查詢能力。
主要職責：跨主域事件的 read projection、指標查詢與 dashboard 資料供應。

> **DDD 分類**: Supporting / Generic ｜ **角色**: 系統行為觀測層 — event tracking、funnel/usage analytics、AI 成本追蹤、dashboard metrics

## Boundary Rules

- `domain/` 禁止依賴 Firestore SDK、React 或任何外部框架。
- `application/queries/` 是主要工作層，**不是** `application/use-cases/`（純讀場景）。
- 若有事件捕獲等寫入行為，才新增 `application/use-cases/`。
- Adapters 只負責查詢 I/O 轉換，禁帶任何業務判斷。
- 外部消費者只透過 `src/modules/analytics/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- `modules/analytics` 的 6 個子域目前均為 stub（README only）。
- src 版本採最小骨架：一個 MetricsQueryPort + 一個 EventIngestionPort 足以支撐初期需求。
- 不預建 dashboards、realtime-insights、experimentation 等尚無具體需求的概念。
- 待有具體 analytics use case 才展開對應子域邏輯。

## Route Here When

- 需要查詢彙整指標（`GetMetricsQuery`）。
- 需要查詢 dashboard 摘要資料（`GetDashboardSummaryQuery`）。
- 需要捕獲跨模組事件作為 analytics 輸入（`EventIngestionPort`）。

## Route Elsewhere When

- 身份、存取治理 → `src/modules/iam`。
- 訂閱配額商業邏輯 → `src/modules/billing`。
- 知識內容 → `src/modules/notion`。
- 工作區 activity feed / 稽核 → `src/modules/workspace`（local concerns）。
- AI 能力 → `src/modules/ai`。

## Development Order

```
domain/ports/ → application/queries/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 預設走 query-first：`application/queries/` 優先，use-cases 按需後補。
- 最小原則：metrics + event-ingestion 兩個 port 是 MVP；dashboards、realtime 等待需求明確化。
- 奧卡姆剃刀：若一個 query 能回答問題，不需新增 service 層。
- 測試時 mock port，不需要真實 Firestore。
