"use client";

/**
 * WikiBetaLibrariesTableView — notion-like database/library view.
 *
 * Left panel shows library list; right panel shows the selected library's
 * fields and rows in a table-like layout. Follows the wiki-beta naming
 * alignment: "Libraries" (not "Databases") in UI.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Database,
  Plus,
  Table2,
  Type,
  Hash,
  ListFilter,
  Link2,
} from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui-shadcn/ui/table";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { cn } from "@ui-shadcn/utils";

import {
  addWikiBetaLibraryField,
  createWikiBetaLibrary,
  createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries,
} from "../../application";
import type {
  WikiBetaLibrary,
  WikiBetaLibraryFieldType,
  WikiBetaLibraryRow,
} from "../../domain";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface WikiBetaLibrariesTableViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

const FIELD_TYPES: { value: WikiBetaLibraryFieldType; label: string; icon: typeof Type }[] = [
  { value: "title", label: "Title", icon: Type },
  { value: "text", label: "Text", icon: Type },
  { value: "number", label: "Number", icon: Hash },
  { value: "select", label: "Select", icon: ListFilter },
  { value: "relation", label: "Relation", icon: Link2 },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/* ------------------------------------------------------------------ */
/*  Field type icon                                                   */
/* ------------------------------------------------------------------ */

function FieldTypeIcon({ type }: { readonly type: string }) {
  const found = FIELD_TYPES.find((f) => f.value === type);
  if (!found) return <Type className="size-3.5 text-muted-foreground" />;
  const Icon = found.icon;
  return <Icon className="size-3.5 text-muted-foreground" />;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function WikiBetaLibrariesTableView({
  accountId,
  workspaceId,
}: WikiBetaLibrariesTableViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [libraries, setLibraries] = useState<WikiBetaLibrary[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
  const [fieldsPreview, setFieldsPreview] = useState<
    { key: string; label: string; type: string }[]
  >([]);
  const [rowsPreview, setRowsPreview] = useState<WikiBetaLibraryRow[]>([]);

  // Create library dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [libraryName, setLibraryName] = useState("");

  // Add field dialog
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [fieldKey, setFieldKey] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<WikiBetaLibraryFieldType>("text");

  // Add row dialog
  const [rowDialogOpen, setRowDialogOpen] = useState(false);
  const [rowJson, setRowJson] = useState('{"title":"New record"}');

  const selectedLibrary = useMemo(
    () => libraries.find((l) => l.id === selectedLibraryId) ?? null,
    [libraries, selectedLibraryId],
  );

  /* ── Data loading ── */

  const refreshLibraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiBetaLibraries(accountId, workspaceId);
      setLibraries(result);
      if (!selectedLibraryId && result.length > 0) {
        setSelectedLibraryId(result[0].id);
      }
      if (result.length === 0) setSelectedLibraryId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, [accountId, selectedLibraryId, workspaceId]);

  const refreshSnapshot = useCallback(async () => {
    if (!selectedLibraryId) {
      setFieldsPreview([]);
      setRowsPreview([]);
      return;
    }
    try {
      const snap = await getWikiBetaLibrarySnapshot(accountId, selectedLibraryId);
      setFieldsPreview(snap.fields.map((f) => ({ key: f.key, label: f.label, type: f.type })));
      setRowsPreview(snap.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入快照失敗");
    }
  }, [accountId, selectedLibraryId]);

  useEffect(() => {
    void refreshLibraries();
  }, [refreshLibraries]);

  useEffect(() => {
    void refreshSnapshot();
  }, [refreshSnapshot]);

  /* ── Handlers ── */

  const handleCreateLibrary = useCallback(async () => {
    if (!libraryName.trim()) return;
    try {
      await createWikiBetaLibrary({ accountId, workspaceId, name: libraryName.trim() });
      setLibraryName("");
      setCreateDialogOpen(false);
      await refreshLibraries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "建立失敗");
    }
  }, [accountId, libraryName, refreshLibraries, workspaceId]);

  const handleAddField = useCallback(async () => {
    if (!selectedLibraryId || !fieldKey.trim() || !fieldLabel.trim()) return;
    try {
      await addWikiBetaLibraryField({
        accountId,
        libraryId: selectedLibraryId,
        key: fieldKey.trim(),
        label: fieldLabel.trim(),
        type: fieldType,
      });
      setFieldKey("");
      setFieldLabel("");
      setFieldDialogOpen(false);
      await refreshSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "新增欄位失敗");
    }
  }, [accountId, fieldKey, fieldLabel, fieldType, refreshSnapshot, selectedLibraryId]);

  const handleCreateRow = useCallback(async () => {
    if (!selectedLibraryId) return;
    try {
      const parsed = JSON.parse(rowJson);
      if (!isRecord(parsed)) throw new Error("JSON 必須為物件");
      await createWikiBetaLibraryRow({
        accountId,
        libraryId: selectedLibraryId,
        values: parsed,
      });
      setRowDialogOpen(false);
      await refreshSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "建立記錄失敗");
    }
  }, [accountId, refreshSnapshot, rowJson, selectedLibraryId]);

  return (
    <div className="flex h-full min-h-0">
      {/* ── Left: Library list ── */}
      <div className="flex w-56 flex-col border-r border-border/60">
        <div className="flex h-10 items-center justify-between border-b border-border/60 px-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Libraries
          </span>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6" aria-label="新增 Library">
                <Plus className="size-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>新增 Library</DialogTitle>
                <DialogDescription>
                  建立一個新的結構化資料庫來管理記錄。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="library-name" className="text-xs">名稱</Label>
                  <Input
                    id="library-name"
                    value={libraryName}
                    onChange={(e) => setLibraryName(e.target.value)}
                    placeholder="例如：專案清單"
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleCreateLibrary();
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button size="sm" onClick={() => void handleCreateLibrary()} disabled={!libraryName.trim()}>
                  建立
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 overflow-auto p-1">
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : libraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Database className="mb-2 size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">尚無 Library</p>
            </div>
          ) : (
            libraries.map((lib) => (
              <button
                key={lib.id}
                type="button"
                onClick={() => setSelectedLibraryId(lib.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition",
                  selectedLibraryId === lib.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Table2 className="size-4 shrink-0 text-muted-foreground/60" />
                <span className="truncate">{lib.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right: Table view ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {selectedLibrary ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
              <div className="flex items-center gap-2">
                <Table2 className="size-4 text-muted-foreground/60" />
                <h2 className="text-sm font-semibold text-foreground">
                  {selectedLibrary.name}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {selectedLibrary.slug}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                {/* Add Field */}
                <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Plus className="mr-1 size-3" />
                      欄位
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[380px]">
                    <DialogHeader>
                      <DialogTitle>新增欄位</DialogTitle>
                      <DialogDescription>
                        定義此 Library 的資料欄位。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Key</Label>
                        <Input
                          value={fieldKey}
                          onChange={(e) => setFieldKey(e.target.value)}
                          placeholder="欄位 key"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={fieldLabel}
                          onChange={(e) => setFieldLabel(e.target.value)}
                          placeholder="欄位名稱"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">類型</Label>
                        <Select
                          value={fieldType}
                          onValueChange={(v) => setFieldType(v as WikiBetaLibraryFieldType)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((ft) => (
                              <SelectItem key={ft.value} value={ft.value}>
                                {ft.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        size="sm"
                        onClick={() => void handleAddField()}
                        disabled={!fieldKey.trim() || !fieldLabel.trim()}
                      >
                        新增
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Row */}
                <Dialog open={rowDialogOpen} onOpenChange={setRowDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Plus className="mr-1 size-3" />
                      記錄
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle>新增記錄</DialogTitle>
                      <DialogDescription>
                        以 JSON 格式輸入欄位值。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <Textarea
                        value={rowJson}
                        onChange={(e) => setRowJson(e.target.value)}
                        placeholder='{"title": "..."}'
                        className="min-h-28 font-mono text-xs"
                      />
                    </div>
                    <DialogFooter>
                      <Button size="sm" onClick={() => void handleCreateRow()}>
                        建立
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {fieldsPreview.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Table2 className="mb-3 size-10 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">
                    尚未定義欄位
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    點擊「+ 欄位」來定義此 Library 的資料結構。
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 text-center text-xs">#</TableHead>
                      {fieldsPreview.map((field) => (
                        <TableHead key={field.key} className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <FieldTypeIcon type={field.type} />
                            <span>{field.label}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowsPreview.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={fieldsPreview.length + 1}
                          className="py-8 text-center text-xs text-muted-foreground"
                        >
                          尚無記錄 — 點擊「+ 記錄」新增第一筆。
                        </TableCell>
                      </TableRow>
                    ) : (
                      rowsPreview.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-center text-xs text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          {fieldsPreview.map((field) => (
                            <TableCell key={field.key} className="text-xs">
                              {row.values[field.key] != null
                                ? String(row.values[field.key])
                                : "—"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        ) : (
          /* No library selected */
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Database className="mb-3 size-12 text-muted-foreground/20" />
            <h3 className="text-base font-medium text-foreground">
              選擇或建立一個 Library
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              從左側選擇一個 Library 來查看其欄位與記錄，或按 + 建立新的。
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
