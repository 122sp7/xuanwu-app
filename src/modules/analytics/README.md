# Analytics Module

`src/modules/analytics` 是蒸餾自 `modules/analytics` 的精簡等價版，以 `src/modules/template` 骨架為基線。
Analytics 為 **read-oriented**：所有子域目前均為 stub（README only），因此 src 版本採最小骨架，查詢邏輯走 `application/queries/`，待有具體 analytics use case 時才展開。

## 蒸餾來源

`modules/analytics`（6 個 stub subdomains：event-contracts、event-ingestion、event-projection、insights、metrics、realtime-insights）
→ `src/modules/analytics`（最小查詢骨架）

## 目錄結構

```
src/modules/analytics/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    ports/
      MetricsQueryPort.ts                     ← read-only metrics query abstraction
      EventIngestionPort.ts                   ← event write abstraction
  application/
    index.ts
    queries/                                  ← 純查詢（無副作用），analytics 預設不用 use-case
      GetMetricsQuery.ts
      GetDashboardSummaryQuery.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← analytics HTTP endpoints
    outbound/
      index.ts
      firestore/                              ← FirestoreMetricsQueryAdapter
                                              ← FirestoreEventIngestionAdapter
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | ports |
| `application/index.ts` | queries |
| `adapters/inbound/index.ts` | http |
| `adapters/outbound/index.ts` | firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/analytics | 狀態 |
|---|---|---|
| domain/ports/MetricsQueryPort | subdomains/metrics（stub） | ✅ 最小必需 port |
| domain/ports/EventIngestionPort | subdomains/event-ingestion（stub） | ✅ 最小必需 port |
| dashboards, realtime-insights | subdomains/*（stub） | ❌ 跳過（待需求具體化） |
| experimentation, decision-support | gap subdomains | ❌ 跳過 |

## 設計注意事項

- analytics 以 **查詢（query）** 為主，`application/use-cases/` **不是**預設位置；純讀走 `application/queries/`。
- 若有需要寫入的業務行為（事件捕獲），才考慮新增 `application/use-cases/`。
- analytics 不擁有上游寫入模型；事件由其他模組推送。

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firestore SDK、React 或任何外部框架。

## 外部消費方式

```ts
// types
import type { MetricsQueryPort, DashboardSummary } from "@/src/modules/analytics";

// queries
import { GetMetricsQuery } from "@/src/modules/analytics";
```

原始 API 合約參考：`modules/analytics/api/index.ts`。
