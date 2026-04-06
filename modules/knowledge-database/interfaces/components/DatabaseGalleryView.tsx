"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseGalleryView — card grid view for database records.
 *
 * Each record is rendered as a card showing the first text field as title
 * and remaining fields as metadata rows.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries/knowledge-database.queries";
import { createRecord, deleteRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

interface DatabaseGalleryViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecord, fieldId: string): unknown {
  if (record.properties instanceof Map) return record.properties.get(fieldId);
  return (record.properties as Record<string, unknown>)[fieldId];
}

function formatValue(field: Field, value: unknown): string {
  if (value == null || value === "") return "—";
  if (field.type === "checkbox") return value ? "✓" : "✗";
  if (field.type === "date" && typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("zh-TW");
  }
  return String(value);
}

function RecordCard({
  record,
  fields,
  onDelete,
  isPending,
}: {
  record: DatabaseRecord;
  fields: Field[];
  onDelete: () => void;
  isPending: boolean;
}) {
  const titleField = fields.find((f) => f.type === "text");
  const title = titleField ? String(getProperty(record, titleField.id) ?? "") : record.id.slice(0, 8);
  const metaFields = fields.filter((f) => f.id !== titleField?.id).slice(0, 4);

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        disabled={isPending}
        className="absolute right-2 top-2 invisible rounded p-1 text-muted-foreground hover:text-destructive group-hover:visible transition"
        title="刪除記錄"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Title */}
      <p className="text-sm font-semibold text-foreground leading-tight truncate pr-6">
        {title || <span className="text-muted-foreground">（無標題）</span>}
      </p>

      {/* Metadata rows */}
      {metaFields.length > 0 && (
        <div className="space-y-1">
          {metaFields.map((field) => {
            const val = getProperty(record, field.id);
            const display = formatValue(field, val);
            return (
              <div key={field.id} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground shrink-0 min-w-0 max-w-[80px] truncate">
                  {field.name}
                </span>
                {field.type === "checkbox" ? (
                  <Badge variant={val ? "default" : "outline"} className="h-4 px-1.5 text-[10px]">
                    {display}
                  </Badge>
                ) : (
                  <span className="text-xs text-foreground truncate">{display}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DatabaseGalleryView({
  database,
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseGalleryViewProps) {
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => { load(); }, [load]);

  function handleAddRecord() {
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

  function handleDeleteRecord(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (database.fields.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        此資料庫尚無欄位。請先新增欄位。
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {records.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          尚無記錄。點擊下方「新增記錄」。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              fields={database.fields}
              onDelete={() => handleDeleteRecord(record.id)}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleAddRecord}
        className="w-full text-xs"
      >
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
