"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseBoardView — Kanban board grouped by the first select/multi_select field.
 *
 * If no select field exists, falls back to grouping by a single "No group" column.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries/knowledge-database.queries";
import { createRecord, deleteRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

interface DatabaseBoardViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecord, fieldId: string): unknown {
  if (record.properties instanceof Map) return record.properties.get(fieldId);
  return (record.properties as Record<string, unknown>)[fieldId];
}

function resolveTextValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  return String(value);
}

/** Resolve the board-group value for a record (always a string label). */
function groupKey(record: DatabaseRecord, groupField: Field | undefined): string {
  if (!groupField) return "全部";
  const val = getProperty(record, groupField.id);
  if (Array.isArray(val)) return val.length > 0 ? String(val[0]) : "未分類";
  return val != null && String(val).trim() !== "" ? String(val) : "未分類";
}

export function DatabaseBoardView({
  database,
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseBoardViewProps) {
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Use the first select / multi_select field as group axis, fall back to null.
  const groupField: Field | undefined =
    database.fields.find((f) => f.type === "select" || f.type === "multi_select") ??
    undefined;

  // Display fields (everything except the group field, up to 3).
  const displayFields = database.fields
    .filter((f) => f.id !== groupField?.id)
    .slice(0, 3);

  const load = useCallback(async () => {
    if (!accountId || !database.id) return;
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  // Build columns: unique group keys + "未分類" always last.
  const columnKeys: string[] = (() => {
    if (!groupField) return ["全部"];
    const keys = new Set<string>();
    for (const r of records) {
      keys.add(groupKey(r, groupField));
    }
    // Ensure "未分類" is always present at the end.
    const sorted = [...keys].filter((k) => k !== "未分類");
    if (keys.has("未分類") || records.length === 0) sorted.push("未分類");
    return sorted.length === 0 ? ["未分類"] : sorted;
  })();

  function handleAddToColumn(columnLabel: string) {
    startTransition(async () => {
      const properties: Record<string, unknown> = {};
      if (groupField && columnLabel !== "未分類") {
        properties[groupField.id] = columnLabel;
      }
      await createRecord({
        databaseId: database.id,
        workspaceId,
        accountId,
        properties,
        createdByUserId: currentUserId,
      });
      await load();
    });
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      await load();
    });
  }

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-56 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groupField && (
        <p className="text-xs text-muted-foreground">
          看板分組依據：<span className="font-medium text-foreground">{groupField.name}</span>
        </p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {columnKeys.map((col) => {
          const colRecords = records.filter((r) => groupKey(r, groupField) === col);
          return (
            <div
              key={col}
              className="flex w-56 shrink-0 flex-col gap-2 rounded-xl border border-border/60 bg-muted/10 p-3"
            >
              {/* Column header */}
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate text-xs font-semibold text-foreground">{col}</span>
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{colRecords.length}</Badge>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {colRecords.map((record) => (
                  <BoardCard
                    key={record.id}
                    record={record}
                    displayFields={displayFields}
                    isPending={isPending}
                    onDelete={() => handleDelete(record.id)}
                  />
                ))}
              </div>

              {/* Add to column */}
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                disabled={isPending}
                onClick={() => handleAddToColumn(col)}
              >
                <Plus className="mr-1.5 h-3 w-3" /> 新增
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BoardCardProps {
  record: DatabaseRecord;
  displayFields: Field[];
  isPending: boolean;
  onDelete: () => void;
}

function BoardCard({ record, displayFields, isPending, onDelete }: BoardCardProps) {
  return (
    <div className="group relative rounded-lg border border-border/60 bg-background p-2.5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
      {/* Grip for future DnD */}
      <GripVertical className="absolute left-1.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/50" />
      <div className="ml-4 space-y-1">
        {displayFields.length === 0 ? (
          <p className="text-xs text-muted-foreground">（無其他欄位）</p>
        ) : (
          displayFields.map((field) => {
            const val = resolveTextValue(getProperty(record, field.id));
            return (
              <div key={field.id} className="text-xs">
                <span className="text-muted-foreground/70">{field.name}：</span>
                <span className="text-foreground">{val || "—"}</span>
              </div>
            );
          })
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={isPending}
        className="absolute right-1.5 top-1.5 invisible rounded p-0.5 text-muted-foreground hover:text-destructive group-hover:visible"
        aria-label="刪除"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
