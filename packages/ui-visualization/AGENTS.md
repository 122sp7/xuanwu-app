# ui-visualization — Agent Rules

此套件提供 **資料視覺化組件**：圖表（charts）、圖形（graphs）、儀表板 widget。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Chart 組件 | `LineChart`、`BarChart`、`PieChart` 等 React wrapper |
| Graph 組件 | `NetworkGraph`、`TreeDiagram` 等 |
| 儀表板 widget 原語 | `StatCard`、`MetricDisplay` 等數字展示組件 |
| Chart 共用型別 | `ChartDataPoint`、`ChartSeries` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 資料聚合 / 業務計算 | `src/modules/analytics/` |
| 儀表板頁面組合 | `src/app/` 或 `src/modules/analytics/interfaces/` |

---

## 嚴禁

- 不得在組件內直接呼叫 Firestore 或 API
- 不得包含業務資料聚合邏輯（圖表只接受已計算的資料 props）
- 不得 import `src/modules/*`

## Alias

```ts
import { LineChart, StatCard } from '@ui-visualization'
```
