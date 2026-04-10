"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseGalleryView — card grid for database records.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field } from "../../domain/aggregates/Database";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";

interface DatabaseGalleryViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseGalleryView({ database, accountId, workspaceId, currentUserId }: DatabaseGalleryViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const titleField = database.fields.find((f) => f.type === "text") ?? null;
  const metaFields = database.fields.filter((f) => f !== titleField).slice(0, 4);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  function handleAdd() {
    startTransition(async () => {
      await createRecord({ databaseId: database.id, workspaceId, accountId, properties: {}, createdByUserId: currentUserId });
      void load();
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {records.length === 0 ? (
          <p className="col-span-full rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">尚無記錄</p>
        ) : (
          records.map((record) => {
            const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "（未命名）" : "（未命名）";
            return (
              <div key={record.id} className="group relative flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                <p className="truncate text-sm font-medium leading-snug">{title}</p>
                <div className="flex flex-wrap gap-1">
                  {metaFields.map((field) => {
                    const val = getProperty(record, field.id);
                    if (val == null || val === "") return null;
                    return (
                      <Badge key={field.id} variant="outline" className="text-[10px]">
                        {field.name}: {String(val).slice(0, 16)}
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 hidden h-6 w-6 text-muted-foreground hover:text-destructive group-hover:flex"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </div>
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAdd} className="w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
