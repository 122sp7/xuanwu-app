"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries/knowledge-database.queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

// Re-exported via api/index.ts — but internal usage is fine via relative path
interface DatabaseTableViewProps {
  database: Database;
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

/** Resolve a Map<string,unknown> or Record<string,unknown> to a plain JS value for display */
function getProperty(record: DatabaseRecord, fieldId: string): unknown {
  if (record.properties instanceof Map) {
    return record.properties.get(fieldId);
  }
  return (record.properties as Record<string, unknown>)[fieldId];
}

function setProperty(record: DatabaseRecord, fieldId: string, value: unknown): Record<string, unknown> {
  const existing: Record<string, unknown> = record.properties instanceof Map
    ? Object.fromEntries(record.properties)
    : { ...(record.properties as Record<string, unknown>) };
  return { ...existing, [fieldId]: value };
}

function CellInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
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

export function DatabaseTableView({
  database,
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseTableViewProps) {
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  /** Tracks inline edits keyed by recordId → { fieldId → value } */
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

  useEffect(() => { load(); }, [load]);

  function handleCellChange(recordId: string, fieldId: string, value: unknown) {
    setEdits((prev) => ({
      ...prev,
      [recordId]: { ...(prev[recordId] ?? {}), [fieldId]: value },
    }));
  }

  function _handleCellBlur(record: DatabaseRecord, fieldId: string) {
    const fieldEdits = edits[record.id];
    if (!fieldEdits || !(fieldId in fieldEdits)) return;
    const newProperties = setProperty(record, fieldId, fieldEdits[fieldId]);
    setSaving((prev) => ({ ...prev, [record.id]: true }));
    startTransition(async () => {
      await updateRecord({ id: record.id, accountId, properties: newProperties });
      setSaving((prev) => ({ ...prev, [record.id]: false }));
      setEdits((prev) => {
        const next = { ...prev };
        if (next[record.id]) {
          const fieldMap = { ...next[record.id] };
          delete fieldMap[fieldId];
          if (Object.keys(fieldMap).length === 0) delete next[record.id];
          else next[record.id] = fieldMap;
        }
        return next;
      });
      await load();
    });
  }

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
      await load();
    });
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
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
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {fields.map((field) => (
                <th
                  key={field.id}
                  className={`px-3 py-2 text-left text-xs font-semibold text-muted-foreground ${FIELD_WIDTHS[field.type] ?? FIELD_WIDTHS.default}`}
                >
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
                  尚無記錄。點擊下方「新增記錄」。
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border/40 last:border-b-0 hover:bg-muted/10">
                  {fields.map((field) => {
                    const editedValue = edits[record.id]?.[field.id];
                    const currentValue = editedValue !== undefined ? editedValue : getProperty(record, field.id);
                    return (
                      <td
                        key={field.id}
                        className="px-2 py-1"
                      >
                        <CellInput
                          field={field}
                          value={currentValue}
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
                      className="h-6 w-6"
                      disabled={isPending}
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
