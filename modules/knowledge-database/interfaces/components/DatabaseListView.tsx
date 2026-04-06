"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseListView — flat record list with fields as readable rows.
 *
 * Each record is rendered as a compact card showing all non-empty field values.
 * Supports inline add and delete.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries/knowledge-database.queries";
import { createRecord, deleteRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

interface DatabaseListViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecord, fieldId: string): unknown {
  if (record.properties instanceof Map) return record.properties.get(fieldId);
  return (record.properties as Record<string, unknown>)[fieldId];
}

function displayValue(value: unknown, type: Field["type"]): string {
  if (value === null || value === undefined) return "";
  if (type === "checkbox") return value ? "✓" : "✗";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/** The "title" field is the first text field; used as record label. */
function titleValue(record: DatabaseRecord, fields: Field[]): string {
  const textField = fields.find((f) => f.type === "text");
  if (!textField) return `記錄 ${record.order + 1}`;
  const v = displayValue(getProperty(record, textField.id), "text");
  return v || `記錄 ${record.order + 1}`;
}

export function DatabaseListView({
  database,
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseListViewProps) {
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const fields = database.fields;

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

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    startTransition(async () => {
      await createRecord({
        databaseId: database.id,
        workspaceId,
        accountId,
        properties: {},
        createdByUserId: currentUserId,
      });
      await load();
    });
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        此資料庫尚無欄位。請先新增欄位。
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {records.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          尚無記錄。點擊「新增記錄」開始。
        </p>
      ) : (
        records.map((record) => {
          const isOpen = expanded.has(record.id);
          const title = titleValue(record, fields);
          // Secondary fields: non-empty values excluding the "title" field.
          const titleFieldId = fields.find((f) => f.type === "text")?.id;
          const secondaryFields = fields.filter((f) => f.id !== titleFieldId);

          return (
            <div
              key={record.id}
              className="group rounded-lg border border-border/60 bg-background"
            >
              {/* Row header */}
              <div className="flex items-center gap-1 px-3 py-2">
                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
                  onClick={() => toggleExpand(record.id)}
                  aria-label={isOpen ? "折疊" : "展開"}
                >
                  {isOpen
                    ? <ChevronDown className="h-3.5 w-3.5" />
                    : <ChevronRight className="h-3.5 w-3.5" />}
                </button>

                <span className="flex-1 truncate text-sm font-medium text-foreground">{title}</span>

                {/* Show a few badge-style field values in the row */}
                <div className="hidden gap-1 sm:flex">
                  {secondaryFields.slice(0, 2).map((field) => {
                    const val = displayValue(getProperty(record, field.id), field.type);
                    if (!val) return null;
                    return (
                      <Badge key={field.id} variant="outline" className="text-[10px]">
                        {field.name}: {val.length > 12 ? `${val.slice(0, 12)}…` : val}
                      </Badge>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(record.id)}
                  disabled={isPending}
                  className="invisible rounded p-1 text-muted-foreground hover:text-destructive group-hover:visible"
                  aria-label="刪除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-border/40 px-4 py-3">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                    {fields.map((field) => {
                      const val = displayValue(getProperty(record, field.id), field.type);
                      return (
                        <div key={field.id} className="contents">
                          <dt className="text-muted-foreground">{field.name}</dt>
                          <dd className="text-foreground">{val || <span className="text-muted-foreground/50">—</span>}</dd>
                        </div>
                      );
                    })}
                    <div className="contents">
                      <dt className="text-muted-foreground">建立時間</dt>
                      <dd className="text-foreground">
                        {new Date(record.createdAtISO).toLocaleString("zh-TW", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          );
        })
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleAdd}
        className="mt-1 w-full text-xs"
      >
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
