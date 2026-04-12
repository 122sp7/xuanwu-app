"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseTablePanel ??spreadsheet-style table with inline cell editing.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseTablePanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

const FIELD_WIDTHS: Record<string, string> = {
  text: "min-w-[180px]",
  number: "min-w-[100px]",
  checkbox: "min-w-[80px]",
  date: "min-w-[140px]",
  default: "min-w-[140px]",
};

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

function setProperty(record: DatabaseRecordSnapshot, fieldId: string, value: unknown): Record<string, unknown> {
  const props = typeof record.properties === "object" && record.properties !== null
    ? { ...(record.properties as Record<string, unknown>) }
    : {};
  props[fieldId] = value;
  return props;
}

function CellInput({ field, value, onChange, disabled }: { field: Field; value: unknown; onChange: (v: unknown) => void; disabled: boolean }) {
  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value == null ? "" : String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="h-7 border-transparent bg-transparent px-1 text-xs focus:border-border"
      />
    );
  }
  return (
    <Input
      type="text"
      value={value == null ? "" : String(value)}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 border-transparent bg-transparent px-1 text-xs focus:border-border"
    />
  );
}

export function DatabaseTablePanel({ database, accountId, workspaceId, currentUserId }: DatabaseTablePanelProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
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

  function handleCellChange(recordId: string, fieldId: string, value: unknown) {
    setEdits((prev) => ({
      ...prev,
      [recordId]: { ...(prev[recordId] ?? {}), [fieldId]: value },
    }));
  }

  function handleCellBlur(record: DatabaseRecordSnapshot, fieldId: string) {
    const cellValue = edits[record.id]?.[fieldId];
    if (cellValue === undefined) return;
    setSaving((prev) => ({ ...prev, [record.id]: true }));
    startTransition(async () => {
      await updateRecord({ id: record.id, accountId, properties: setProperty(record, fieldId, cellValue) });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[record.id];
        return next;
      });
      setSaving((prev) => ({ ...prev, [record.id]: false }));
    });
  }

  function handleAddRecord() {
    startTransition(async () => {
      await createRecord({
        databaseId: database.id, workspaceId, accountId, properties: {}, createdByUserId: currentUserId,
      });
      void load();
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
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        No fields yet. Add at least one field to start entering records.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {fields.map((field) => (
                <th key={field.id} className={`px-3 py-2 text-left text-xs font-semibold text-muted-foreground ${FIELD_WIDTHS[field.type] ?? FIELD_WIDTHS.default}`}>
                  {field.name}
                  {field.required && <span className="ml-0.5 text-destructive">*</span>}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 1} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No records
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border/30 last:border-b-0 hover:bg-muted/10">
                  {fields.map((field) => {
                    const edited = edits[record.id]?.[field.id];
                    const current = edited !== undefined ? edited : getProperty(record, field.id);
                    return (
                      <td key={field.id} className="px-2 py-1">
                        <CellInput
                          field={field}
                          value={current}
                          onChange={(v) => handleCellChange(record.id, field.id, v)}
                          disabled={saving[record.id] ?? false}
                        />
                      </td>
                    );
                  })}
                  <td className="px-1 py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      disabled={isPending}
                      onBlur={() => {
                        fields.forEach((f) => { if (edits[record.id]?.[f.id] !== undefined) handleCellBlur(record, f.id); });
                      }}
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAddRecord} className="w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> Add record
      </Button>
    </div>
  );
}

