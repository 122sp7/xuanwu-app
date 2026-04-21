# @infra/table

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


Headless table state management via **TanStack Table v8**.

## Purpose

提供無 UI 耦合的表格狀態管理（排序、過濾、分頁、選取、分組），作為 `interfaces/` 層的表格邏輯基礎。此套件只負責 headless 狀態，UI 渲染由消費方提供（通常搭配 `packages/ui-shadcn/` 的 `Table*` 組件）。

## Import

```ts
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@infra/table'
```

## Core Usage

### 基本表格

```tsx
"use client"
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@infra/table'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@ui-shadcn'

type Task = { id: string; title: string; status: string }

const columnHelper = createColumnHelper<Task>()
const columns = [
  columnHelper.accessor('title', { header: '標題' }),
  columnHelper.accessor('status', { header: '狀態' }),
]

function TaskTable({ data }: { data: Task[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### 加入排序與分頁

```tsx
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type SortingState, type PaginationState } from '@infra/table'
import { useState } from 'react'

const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

const table = useReactTable({
  data,
  columns,
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useReactTable` | Hook | 主要表格 hook |
| `createColumnHelper` | Factory | 型別安全欄位定義工廠 |
| `flexRender` | Helper | 渲染欄位 cell / header 內容 |
| `getCoreRowModel` | Factory | 基礎 row model（必填） |
| `getSortedRowModel` | Factory | 排序 row model |
| `getFilteredRowModel` | Factory | 過濾 row model |
| `getPaginationRowModel` | Factory | 分頁 row model |
| `getGroupedRowModel` | Factory | 分組 row model |
| `getExpandedRowModel` | Factory | 展開 row model |
| `getSelectedRowModel` | Factory | 選取 row model |
| `SortingState` | Type | 排序狀態陣列型別 |
| `PaginationState` | Type | 分頁狀態型別 |
| `RowSelectionState` | Type | 列選取狀態型別 |
| `ColumnDef` | Type | 欄位定義型別 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 業務過濾條件屬於 `domain/`，UI 表格 state 屬於此套件
- 虛擬化長清單搭配 `packages/infra/virtual/`
- 表格 HTML 結構使用 `packages/ui-shadcn/` 的 `Table*` 組件
