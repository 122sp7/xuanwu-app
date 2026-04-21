# @infra/date

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Date manipulation utilities via **date-fns v4**.

## Purpose

提供純函式的日期原語，供 `interfaces/`、`application/` 與共享套件做格式化、比較與日期區間計算。
這裡只封裝通用日期能力，不承載任何業務日曆規則。

## Import

```ts
import {
  format,
  parseISO,
  addDays,
  startOfMonth,
  differenceInDays,
  type Locale,
} from '@infra/date'
```

## Key Exports

| 類別 | 代表函式 |
|---|---|
| Parsing & formatting | `parse`, `parseISO`, `format`, `formatISO` |
| Validation | `isValid`, `isDate` |
| Arithmetic | `addDays`, `subWeeks`, `addMonths`, `subYears` |
| Boundaries | `startOfDay`, `endOfWeek`, `startOfMonth`, `endOfYear` |
| Comparison | `isBefore`, `isAfter`, `isEqual`, `compareAsc` |
| Difference | `differenceInDays`, `differenceInHours`, `differenceInMonths` |

## Guardrails

- 只放通用日期工具，不放業務時程邏輯
- 保持純函式，避免副作用
- 業務語意（例如工作日、需求優先級日曆）屬於 owning module
