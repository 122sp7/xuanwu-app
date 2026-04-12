"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseBoardPanel ??Kanban board grouped by first select/multi_select field.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseBoardPanelProps {
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

export function DatabaseBoardPanel({ database, accountId, workspaceId, currentUserId }: DatabaseBoardPanelProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const groupField = database.fields.find((f) => f.type === "select" || f.type === "multi_select") ?? null;

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

  function getTitle(record: DatabaseRecordSnapshot): string {
    const textField = database.fields.find((f) => f.type === "text");
    if (!textField) return record.id.slice(0, 8);
    return String(getProperty(record, textField.id) ?? "Untitled");
  }

  const groups: Record<string, DatabaseRecordSnapshot[]> = {};
  if (!groupField) {
    groups["No Group"] = records;
  } else {
    for (const record of records) {
      const val = getProperty(record, groupField.id);
      const key = val != null && val !== "" ? String(val) : "No Group";
      (groups[key] ??= []).push(record);
    }
    if ("No Group" in groups) {
      const noGroup = groups["No Group"];
      delete groups["No Group"];
      groups["No Group"] = noGroup;
    }
  }

  function handleAdd(groupValue: string) {
    startTransition(async () => {
      const props: Record<string, unknown> = groupField && groupValue !== "No Group"
        ? { [groupField.id]: groupValue }
        : {};
      await createRecord({ databaseId: database.id, workspaceId, accountId, properties: props, createdByUserId: currentUserId });
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
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Object.entries(groups).map(([group, groupRecords]) => (
        <div key={group} className="flex w-52 shrink-0 flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">{group}</Badge>
            <span className="text-[10px] text-muted-foreground">{groupRecords.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {groupRecords.map((record) => (
              <div key={record.id} className="group relative rounded-md border border-border/60 bg-card px-3 py-2 shadow-sm">
                <p className="text-sm font-medium leading-snug">{getTitle(record)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 hidden h-5 w-5 text-muted-foreground hover:text-destructive group-hover:flex"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            disabled={isPending}
            onClick={() => handleAdd(group)}
          >
            <Plus className="mr-1 h-3 w-3" /> ?啣?
          </Button>
        </div>
      ))}
    </div>
  );
}

