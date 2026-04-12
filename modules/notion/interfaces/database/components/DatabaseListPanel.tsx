"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseListPanel ??flat record list with fields as readable rows.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseListPanelProps {
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

function displayValue(val: unknown, type: string): string {
  if (val == null || val === "") return "";
  if (type === "checkbox") return val ? "?? : "??;
  return String(val);
}

export function DatabaseListPanel({ database, accountId, workspaceId, currentUserId }: DatabaseListPanelProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const titleField = database.fields.find((f) => f.type === "text") ?? database.fields[0] ?? null;
  const secondaryFields = database.fields.filter((f) => f !== titleField);

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
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {records.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">撠閮?</p>
      ) : (
        records.map((record) => {
          const isOpen = expanded.has(record.id);
          const title = titleField ? displayValue(getProperty(record, titleField.id), titleField.type) || "嚗?賢?嚗? : record.id.slice(0, 8);

          return (
            <div key={record.id} className="rounded-md border border-border/60 bg-card">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted"
                  onClick={() => toggleExpand(record.id)}
                >
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                <span className="flex-1 truncate text-sm font-medium text-foreground">{title}</span>
                <div className="hidden gap-1 sm:flex">
                  {secondaryFields.slice(0, 2).map((field) => {
                    const val = displayValue(getProperty(record, field.id), field.type);
                    if (!val) return null;
                    return (
                      <Badge key={field.id} variant="outline" className="text-[10px]">
                        {field.name}: {val.length > 12 ? `${val.slice(0, 12)}?圳 : val}
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {isOpen && (
                <div className="border-t border-border/40 px-4 py-3">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                    {database.fields.map((field) => {
                      const val = displayValue(getProperty(record, field.id), field.type);
                      return (
                        <div key={field.id} className="contents">
                          <dt className="text-muted-foreground">{field.name}</dt>
                          <dd className="text-foreground">{val || <span className="text-muted-foreground/50">??/span>}</dd>
                        </div>
                      );
                    })}
                    <div className="contents">
                      <dt className="text-muted-foreground">撱箇???</dt>
                      <dd className="text-foreground">
                        {new Date(record.createdAtISO).toLocaleString("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          );
        })
      )}
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAdd} className="mt-1 w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> ?啣?閮?
      </Button>
    </div>
  );
}

