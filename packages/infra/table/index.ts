/**
 * @module infra/table
 * Headless table state management via TanStack Table v8.
 *
 * useReactTable — main hook; accepts data, columns, getCoreRowModel and optional
 *   feature row models (sorting, filtering, pagination, selection, etc.).
 * createColumnHelper — type-safe column definition factory (recommended over raw ColumnDef).
 * flexRender — renders cell / header content (handles JSX elements and plain values).
 *
 * Alias: @infra/table
 */

// ─── Core Hook & Helpers ──────────────────────────────────────────────────────

export { useReactTable } from "@tanstack/react-table";
export { createColumnHelper } from "@tanstack/react-table";
export { flexRender } from "@tanstack/react-table";

// ─── Row Model Factories ──────────────────────────────────────────────────────

export { getCoreRowModel } from "@tanstack/react-table";
export { getSortedRowModel } from "@tanstack/react-table";
export { getFilteredRowModel } from "@tanstack/react-table";
export { getPaginationRowModel } from "@tanstack/react-table";
export { getGroupedRowModel } from "@tanstack/react-table";
export { getExpandedRowModel } from "@tanstack/react-table";
export { getSelectedRowModel } from "@tanstack/react-table";

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  VisibilityState,
  ColumnOrderState,
  ColumnResizeMode,
  ColumnResizeDirection,
  Table,
  Row,
  Cell,
  Header,
  HeaderGroup,
  CellContext,
  HeaderContext,
  ColumnHelper,
  OnChangeFn,
  Updater,
  TableOptions,
  FilterFn,
  SortingFn,
} from "@tanstack/react-table";
