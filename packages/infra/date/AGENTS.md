# infra/date — Agent Rules

此套件提供 **日期處理原語**，封裝 `date-fns` 的解析、格式化、比較與區間工具。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 日期格式化 | `format`、`formatISO`、`formatDistance` |
| 日期解析 | `parse`、`parseISO` |
| 日期比較 | `isBefore`、`isAfter`、`compareAsc` |
| 日期區間邊界 | `startOfDay`、`endOfMonth`、`startOfWeek` |
| 日期運算 | `addDays`、`subMonths`、`differenceInDays` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務日曆規則、排程語意 | `src/modules/<context>/domain/` 或 `application/` |
| 時區 / locale 業務決策 | owning module `interfaces/` 或 `application/` |
| Server-state 快取 | `packages/infra/query/` |

---

## 嚴禁

- 不得在此套件加入業務判斷或 workflow 規則
- 不得 import `src/modules/*`
- 不得依賴任何外部服務或 I/O

## Alias

```ts
import { format, parseISO, addDays } from '@infra/date'
```
