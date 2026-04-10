"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@lib-tanstack";
import { draggable, dropTargetForElements, monitorForElements } from "@lib-dragdrop";

import { getWikiLibrarySnapshot, listWikiLibraries, type WikiLibraryRow } from "../..";

interface LibraryTableViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

type RowData = WikiLibraryRow & { _values: Record<string, unknown> };

const columnHelper = createColumnHelper<RowData>();

/**
 * LibraryTableView
 *
 * TanStack Table rendering library rows with:
 * - Column-level text filter (global filter input)
 * - Drag-to-reorder rows via pragmatic-drag-and-drop
 */
export function LibraryTableView({ accountId, workspaceId }: LibraryTableViewProps) {
  const [libraries, setLibraries] = useState<{ id: string; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [fieldKeys, setFieldKeys] = useState<string[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load library list
  useEffect(() => {
    void (async () => {
      try {
        const result = await listWikiLibraries(accountId, workspaceId);
        setLibraries(result.map((l) => ({ id: l.id, name: l.name })));
        if (result.length > 0 && result[0]) setSelectedId(result[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入 Libraries 失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, workspaceId]);

  // Load rows when selection changes
  useEffect(() => {
    if (!selectedId) return;
    void (async () => {
      setLoading(true);
      try {
        const snap = await getWikiLibrarySnapshot(accountId, selectedId);
        const keys = snap.fields.map((f) => f.key);
        setFieldKeys(keys);
        setRows(snap.rows.map((r) => ({ ...r, _values: r.values as Record<string, unknown> })));
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入資料列失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, selectedId]);

  // DnD row reorder
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const fromId = source.data["rowId"] as string | undefined;
        const toId = target.data["rowId"] as string | undefined;
        if (!fromId || !toId || fromId === toId) return;
        setRows((prev) => {
          const fromIdx = prev.findIndex((r) => r.id === fromId);
          const toIdx = prev.findIndex((r) => r.id === toId);
          if (fromIdx === -1 || toIdx === -1) return prev;
          const next = [...prev];
          const [moved] = next.splice(fromIdx, 1);
          if (!moved) return prev;
          next.splice(toIdx, 0, moved);
          return next;
        });
      },
    });
  }, []);

  const columns = useMemo(
    () =>
      fieldKeys.map((key) =>
        columnHelper.accessor((row) => String(row._values[key] ?? ""), {
          id: key,
          header: key,
          cell: (info) => info.getValue(),
        }),
      ),
    [fieldKeys],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Library Table</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">資料庫表格</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          TanStack Table · 全域篩選 · 拖曳重排列
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm"
          aria-label="選擇 Library"
        >
          {libraries.map((lib) => (
            <option key={lib.id} value={lib.id}>{lib.name}</option>
          ))}
        </select>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="篩選…"
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">載入中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && fieldKeys.length === 0 && (
        <p className="text-sm text-muted-foreground">此 Library 尚未定義欄位，請先在 Libraries 頁面新增欄位與資料列。</p>
      )}

      {fieldKeys.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  <th className="w-8 px-2 py-2" />
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/40">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={fieldKeys.length + 1} className="px-3 py-4 text-center text-sm text-muted-foreground">無資料</td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} rowId={row.original.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </DraggableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

interface DraggableRowProps {
  readonly rowId: string;
  readonly children: React.ReactNode;
}

function DraggableRow({ rowId, children }: DraggableRowProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleEl = dragHandleRef.current;
    const rowEl = rowRef.current;
    if (!handleEl || !rowEl) return;
    const cleanupDraggable = draggable({ element: handleEl, getInitialData: () => ({ rowId }) });
    const cleanupDrop = dropTargetForElements({ element: rowEl, getData: () => ({ rowId }) });
    return () => {
      cleanupDraggable();
      cleanupDrop();
    };
  }, [rowId]);

  return (
    <tr ref={rowRef} className="transition hover:bg-muted/20">
      <td className="px-2 py-2">
        <button
          ref={dragHandleRef}
          type="button"
          aria-label="拖曳重排"
          className="cursor-grab touch-none opacity-30 hover:opacity-80 active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-muted-foreground" />
        </button>
      </td>
      {children}
    </tr>
  );
}
