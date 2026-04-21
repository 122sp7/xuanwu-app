# ui-visualization

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


數據視覺化元件（Recharts 2 封裝）。

## 套件結構

```
packages/ui-visualization/
  index.ts    ← StatCard + XuanwuLineChart + XuanwuBarChart + XuanwuPieChart
  AGENTS.md
```

## 公開 API

```ts
import {
  // 統計卡片
  StatCard,
  type StatCardProps,

  // 折線圖
  XuanwuLineChart,
  type XuanwuLineChartProps,

  // 長條圖
  XuanwuBarChart,
  type XuanwuBarChartProps,

  // 圓餅圖 / 環形圖
  XuanwuPieChart,
  type XuanwuPieChartProps,

  // 共用資料型別
  type DataPoint,
  type SeriesConfig,
  type PieDataPoint,
} from '@ui-visualization'
```

## 使用範例

```tsx
'use client'

import { XuanwuLineChart, XuanwuBarChart, XuanwuPieChart } from '@ui-visualization'

// 折線圖
<XuanwuLineChart
  data={[
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
  ]}
  series={[{ dataKey: 'value', label: '收入', color: '#8884d8' }]}
  height={300}
/>

// 長條圖（堆疊）
<XuanwuBarChart
  data={data}
  series={[
    { dataKey: 'done', label: '完成' },
    { dataKey: 'todo', label: '待辦' },
  ]}
  stacked
/>

// 環形圖
<XuanwuPieChart
  data={[{ name: '完成', value: 80 }, { name: '待辦', value: 20 }]}
  innerRadius={60}
/>
```

## 使用規則

- 使用 `ResponsiveContainer` — 不固定 width/height，透過父 div 高度控制。
- 禁止含業務邏輯，只做資料呈現。
- 需要 `'use client'` directive（Recharts 使用 ResizeObserver）。

## 顏色系統

預設使用 CSS variable `--chart-1` ... `--chart-5`（Shadcn 主題變數）。可透過 `series[i].color` 覆寫。

## Context7 官方基線

- 文件：`/recharts/recharts`
- `ResponsiveContainer` + percentage 寬高為標準響應式模式。
