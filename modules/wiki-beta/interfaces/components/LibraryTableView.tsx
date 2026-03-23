"use client";

/**
 * LibraryTableView.tsx
 * Purpose: Enhanced library view using TanStack Table with column sorting,
 *          column resizing, and a dynamic filter builder.
 * Responsibilities: table rendering, sort state, filter state.
 * Constraints: client-only; data passed as props from parent.
 */

import { useState, useCallback, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  X,
  Plus,
} from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@lib-tanstack";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@ui-shadcn/ui/table";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LibraryField {
  key: string;
  label: string;
  type: "title" | "text" | "number" | "select" | "relation";
}

export interface LibraryRow {
  id: string;
  values: Record<string, unknown>;
}

// ── Filter builder ─────────────────────────────────────────────────────────

type FilterOperator = "contains" | "equals" | "startsWith" | "isEmpty";

interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  contains: "包含",
  equals: "等於",
  startsWith: "開頭為",
  isEmpty: "為空",
};

interface FilterBuilderProps {
  fields: LibraryField[];
  rules: FilterRule[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, patch: Partial<FilterRule>) => void;
}

function FilterBuilder({ fields, rules, onAdd, onRemove, onChange }: FilterBuilderProps) {
  return (
    <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          篩選條件
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-6 gap-1 px-2 text-xs"
          onClick={onAdd}
        >
          <Plus className="size-3" />
          新增
        </Button>
      </div>

      {rules.length === 0 ? (
        <p className="py-1 text-xs text-muted-foreground">尚未設定篩選條件</p>
      ) : (
        <div className="space-y-1.5">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-wrap items-center gap-1.5">
              {/* Field selector */}
              <select
                value={rule.field}
                onChange={(e) => onChange(rule.id, { field: e.target.value })}
                className="h-7 rounded border border-border/60 bg-background px-2 text-xs"
              >
                {fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Operator selector */}
              <select
                value={rule.operator}
                onChange={(e) =>
                  onChange(rule.id, { operator: e.target.value as FilterOperator })
                }
                className="h-7 rounded border border-border/60 bg-background px-2 text-xs"
              >
                {(Object.keys(OPERATOR_LABELS) as FilterOperator[]).map((op) => (
                  <option key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </option>
                ))}
              </select>

              {/* Value input (hidden for isEmpty) */}
              {rule.operator !== "isEmpty" && (
                <Input
                  value={rule.value}
                  onChange={(e) => onChange(rule.id, { value: e.target.value })}
                  placeholder="值…"
                  className="h-7 w-28 text-xs"
                />
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(rule.id)}
                aria-label="移除此條件"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Column sort icon ───────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ArrowUp className="ml-1 size-3 shrink-0" />;
  if (direction === "desc") return <ArrowDown className="ml-1 size-3 shrink-0" />;
  return <ArrowUpDown className="ml-1 size-3 shrink-0 opacity-30" />;
}

// ── Badge for field type ──────────────────────────────────────────────────

function FieldTypeBadge({ type }: { type: LibraryField["type"] }) {
  const colourMap: Record<LibraryField["type"], string> = {
    title: "bg-primary/10 text-primary",
    text: "bg-muted text-muted-foreground",
    number: "bg-blue-500/10 text-blue-600",
    select: "bg-orange-500/10 text-orange-600",
    relation: "bg-purple-500/10 text-purple-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest ${colourMap[type]}`}
    >
      {type}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface LibraryTableViewProps {
  fields: LibraryField[];
  rows: LibraryRow[];
  /** Optional table title to display above the table. */
  title?: string;
}

function applyFilterRules(rows: LibraryRow[], rules: FilterRule[]): LibraryRow[] {
  if (rules.length === 0) return rows;

  return rows.filter((row) =>
    rules.every((rule) => {
      const rawValue = row.values[rule.field];
      const cellValue = rawValue == null ? "" : String(rawValue).toLowerCase();
      const ruleValue = rule.value.toLowerCase();

      switch (rule.operator) {
        case "contains": return cellValue.includes(ruleValue);
        case "equals": return cellValue === ruleValue;
        case "startsWith": return cellValue.startsWith(ruleValue);
        case "isEmpty": return cellValue === "";
        default: return true;
      }
    }),
  );
}

export function LibraryTableView({ fields, rows, title }: LibraryTableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // Apply custom filter rules on top of TanStack filter
  const filteredRows = useMemo(() => applyFilterRules(rows, filterRules), [rows, filterRules]);

  const columnHelper = createColumnHelper<LibraryRow>();

  const columns = useMemo(
    () =>
      fields.map((field) =>
        columnHelper.accessor((row) => String(row.values[field.key] ?? ""), {
          id: field.key,
          header: ({ column }) => (
            <button
              type="button"
              className="flex items-center gap-1 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {field.label}
              <FieldTypeBadge type={field.type} />
              <SortIcon direction={column.getIsSorted()} />
            </button>
          ),
          cell: (info) => (
            <span className="text-sm text-foreground">{info.getValue()}</span>
          ),
          enableSorting: true,
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ── Filter rule helpers ──────────────────────────────────────────────────

  const addFilterRule = useCallback(() => {
    const defaultField = fields[0]?.key ?? "";
    setFilterRules((prev) => [
      ...prev,
      { id: `fr_${Date.now()}`, field: defaultField, operator: "contains", value: "" },
    ]);
    setShowFilter(true);
  }, [fields]);

  const removeFilterRule = useCallback((id: string) => {
    setFilterRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateFilterRule = useCallback((id: string, patch: Partial<FilterRule>) => {
    setFilterRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }, []);

  const activeFilterCount = filterRules.filter(
    (r) => r.operator === "isEmpty" || r.value.trim() !== "",
  ).length;

  // ── Render ───────────────────────────────────────────────────────────────

  if (fields.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
        尚未定義欄位，請先新增欄位。
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => setShowFilter((v) => !v)}
          >
            <SlidersHorizontal className="size-3" />
            篩選
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filter builder */}
      {showFilter && (
        <FilterBuilder
          fields={fields}
          rules={filterRules}
          onAdd={addFilterRule}
          onRemove={removeFilterRule}
          onChange={updateFilterRule}
        />
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="whitespace-nowrap py-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={fields.length}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  {filterRules.length > 0
                    ? "沒有符合篩選條件的資料列"
                    : "尚無資料列"}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Row count */}
      <p className="text-xs text-muted-foreground">
        顯示 {table.getRowModel().rows.length} / {rows.length} 筆資料
      </p>
    </div>
  );
}
