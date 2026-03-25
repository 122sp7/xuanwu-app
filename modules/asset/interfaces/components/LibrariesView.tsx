"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  addWikiBetaLibraryField,
  createWikiBetaLibrary,
  createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries,
  type WikiBetaLibrary,
  type WikiBetaLibraryFieldType,
  type WikiBetaLibraryRow,
} from "../../api";

interface WikiBetaLibrariesViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

const FIELD_TYPES: WikiBetaLibraryFieldType[] = ["title", "text", "number", "select", "relation"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFieldType(value: string): WikiBetaLibraryFieldType {
  if (value === "title") return "title";
  if (value === "text") return "text";
  if (value === "number") return "number";
  if (value === "select") return "select";
  if (value === "relation") return "relation";
  return "text";
}

export function LibrariesView({ accountId, workspaceId }: WikiBetaLibrariesViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [libraries, setLibraries] = useState<WikiBetaLibrary[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
  const [fieldsPreview, setFieldsPreview] = useState<{ key: string; label: string; type: string }[]>([]);
  const [rowsPreview, setRowsPreview] = useState<WikiBetaLibraryRow[]>([]);

  const [libraryName, setLibraryName] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<WikiBetaLibraryFieldType>("text");
  const [rowJson, setRowJson] = useState('{"title":"New record"}');

  const selectedLibrary = useMemo(
    () => libraries.find((library) => library.id === selectedLibraryId) ?? null,
    [libraries, selectedLibraryId],
  );

  const refreshLibraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiBetaLibraries(accountId, workspaceId);
      setLibraries(result);
      if (!selectedLibraryId && result.length > 0) {
        setSelectedLibraryId(result[0].id);
      }
      if (result.length === 0) {
        setSelectedLibraryId("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to list libraries");
    } finally {
      setLoading(false);
    }
  }, [accountId, selectedLibraryId, workspaceId]);

  const refreshSelectedSnapshot = useCallback(async () => {
    if (!selectedLibraryId) {
      setFieldsPreview([]);
      setRowsPreview([]);
      return;
    }

    try {
      const snapshot = await getWikiBetaLibrarySnapshot(accountId, selectedLibraryId);
      setFieldsPreview(snapshot.fields.map((field) => ({ key: field.key, label: field.label, type: field.type })));
      setRowsPreview(snapshot.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load library snapshot");
    }
  }, [accountId, selectedLibraryId]);

  useEffect(() => {
    void refreshLibraries();
  }, [refreshLibraries]);

  useEffect(() => {
    void refreshSelectedSnapshot();
  }, [refreshSelectedSnapshot]);

  const handleCreateLibrary = useCallback(async () => {
    try {
      await createWikiBetaLibrary({ accountId, workspaceId, name: libraryName });
      setLibraryName("");
      await refreshLibraries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to create library");
    }
  }, [accountId, libraryName, refreshLibraries, workspaceId]);

  const handleAddField = useCallback(async () => {
    if (!selectedLibraryId) return;
    try {
      await addWikiBetaLibraryField({
        accountId,
        libraryId: selectedLibraryId,
        key: fieldKey,
        label: fieldLabel,
        type: fieldType,
      });
      setFieldKey("");
      setFieldLabel("");
      await refreshSelectedSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to add field");
    }
  }, [accountId, fieldKey, fieldLabel, fieldType, refreshSelectedSnapshot, selectedLibraryId]);

  const handleCreateRow = useCallback(async () => {
    if (!selectedLibraryId) return;
    try {
      const parsed = JSON.parse(rowJson);
      if (!isRecord(parsed)) {
        throw new Error("row JSON must be an object");
      }
      const values = parsed;
      await createWikiBetaLibraryRow({
        accountId,
        libraryId: selectedLibraryId,
        values,
      });
      await refreshSelectedSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to create row");
    }
  }, [accountId, refreshSelectedSnapshot, rowJson, selectedLibraryId]);

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Libraries MVP</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Notion-like Structured Data</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          對齊命名：Database/Data Source 在產品層統一為 Libraries。MVP 支援建立 library、定義 fields、建立 rows。
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          載入 libraries 中...
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 md:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={libraryName}
          onChange={(event) => setLibraryName(event.target.value)}
          placeholder="Library name"
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
        />
        <button
          type="button"
          onClick={() => void handleCreateLibrary()}
          className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          建立 Library
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
          <h3 className="text-sm font-semibold text-foreground">Libraries</h3>

          <select
            value={selectedLibraryId}
            onChange={(event) => setSelectedLibraryId(event.target.value)}
            className="h-9 w-full rounded-md border border-border/60 bg-background px-2 text-sm"
            aria-label="Select library"
          >
            <option value="">Select library</option>
            {libraries.map((library) => (
              <option key={library.id} value={library.id}>
                {library.name} ({library.slug})
              </option>
            ))}
          </select>

          {selectedLibrary ? (
            <p className="text-xs text-muted-foreground">{selectedLibrary.name} / {selectedLibrary.slug}</p>
          ) : (
            <p className="text-xs text-muted-foreground">請先建立或選擇一個 library。</p>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fields</p>
            {fieldsPreview.length === 0 ? (
              <p className="text-xs text-muted-foreground">尚無欄位</p>
            ) : (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {fieldsPreview.map((field) => (
                  <li key={field.key} className="rounded border border-border/60 bg-background px-2 py-1">
                    {field.label} ({field.key}) - {field.type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
          <h3 className="text-sm font-semibold text-foreground">Add Field / Add Row</h3>

          <div className="grid gap-2 md:grid-cols-2">
            <input
              type="text"
              value={fieldKey}
              onChange={(event) => setFieldKey(event.target.value)}
              placeholder="field key"
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm"
            />
            <input
              type="text"
              value={fieldLabel}
              onChange={(event) => setFieldLabel(event.target.value)}
              placeholder="field label"
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={fieldType}
              onChange={(event) => setFieldType(parseFieldType(event.target.value))}
              className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm"
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void handleAddField()}
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              新增欄位
            </button>
          </div>

          <textarea
            value={rowJson}
            onChange={(event) => setRowJson(event.target.value)}
            className="min-h-24 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs"
            placeholder='{"title":"My record"}'
          />

          <button
            type="button"
            onClick={() => void handleCreateRow()}
            className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            建立 Row
          </button>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Rows Preview</p>
            {rowsPreview.length === 0 ? (
              <p className="text-xs text-muted-foreground">尚無資料列</p>
            ) : (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {rowsPreview.slice(0, 5).map((row) => (
                  <li key={row.id} className="rounded border border-border/60 bg-background px-2 py-1">
                    {JSON.stringify(row.values)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
