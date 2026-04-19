# infra/table — Agent Rules

此套件是 **headless 表格狀態管理的唯一授權來源**，透過 TanStack Table v8 提供排序、過濾、分頁、選取等能力。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 表格狀態管理 | `useReactTable({ data, columns, getCoreRowModel() })` |
| 欄位定義 | `createColumnHelper<T>()` — 型別安全欄位定義 |
| 渲染輔助 | `flexRender(cell.column.columnDef.cell, cell.getContext())` |
| Row model 工廠 | `getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel` 等 |
| 表格狀態型別 | `SortingState`, `PaginationState`, `RowSelectionState` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 表格 UI 組件（thead、td、tr 樣式） | `packages/ui-shadcn/` 的 `Table*` 組件 |
| 帶業務語意的資料表（TaskTable、IssueTable） | `src/modules/<context>/interfaces/` |
| 資料查詢與快取 | `packages/infra/query/` |
| 虛擬化長清單 | `packages/infra/virtual/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
// ❌ 不得把業務邏輯寫在 filterFn / sortingFn

// ✅ 正確使用模式
const columnHelper = createColumnHelper<Task>()
const columns = [
  columnHelper.accessor('title', { header: '任務標題' }),
  columnHelper.accessor('status', { header: '狀態' }),
]
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

- 此套件 hook 均需 `"use client"`，不得在 Server Component 使用
- 業務過濾邏輯（invariant）屬於 `domain/`，此套件只做 UI state
- 不得在此套件包含任何業務語意

## Alias

```ts
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from '@infra/table'
```
