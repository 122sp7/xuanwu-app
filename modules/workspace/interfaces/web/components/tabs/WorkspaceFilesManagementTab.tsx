"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileSearch, Loader2, Pencil, Plus, RefreshCw, Trash2, Wand2 } from "lucide-react";

import { FileProcessingDialog } from "@/modules/notebooklm/api/ui";
import {
  deleteWorkspaceManagedFile,
  getWorkspaceManagedFiles,
  renameWorkspaceManagedFile,
  uploadWorkspaceManagedFile,
  type WorkspaceManagedFileItem,
} from "@/modules/workspace/api/facade";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import type { WorkspaceEntity } from "../../../../domain/aggregates/Workspace";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "xuanwu-i-00708880-4e2d8.firebasestorage.app";

type FileStatusFilter = "all" | "uploaded" | "processing" | "ready" | "failed" | "active";

interface ProcessingTarget {
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

function toGsUri(storagePath: string): string {
  const normalized = storagePath.trim().replace(/^\/+/, "");
  return `gs://${DEFAULT_BUCKET}/${normalized}`;
}

function formatFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"] as const;
  let value = sizeBytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function getStatusTone(status: string): "default" | "secondary" | "outline" {
  if (status === "ready") return "default";
  if (status === "processing" || status === "uploaded") return "secondary";
  return "outline";
}

export function WorkspaceFilesManagementTab({ workspace }: { readonly workspace: WorkspaceEntity }) {
  const [documents, setDocuments] = useState<readonly WorkspaceManagedFileItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FileStatusFilter>("all");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [busyDocId, setBusyDocId] = useState<string | null>(null);
  const [processingTarget, setProcessingTarget] = useState<ProcessingTarget | null>(null);

  const reloadLibrary = useCallback(async () => {
    setLoadState("loading");
    try {
      const nextDocuments = await getWorkspaceManagedFiles(workspace);
      setDocuments(nextDocuments);
      setLoadState("loaded");
    } catch {
      setDocuments([]);
      setLoadState("error");
    }
  }, [workspace]);

  useEffect(() => {
    void reloadLibrary();
  }, [reloadLibrary]);

  const filteredDocuments = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesFilter = filter === "all" ? true : doc.status === filter;
      const matchesSearch = !keyword
        || doc.name.toLowerCase().includes(keyword)
        || (doc.sourceFileName?.toLowerCase().includes(keyword) ?? false)
        || doc.mimeType.toLowerCase().includes(keyword);
      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);

  const managedFileCount = useMemo(() => documents.length, [documents.length]);
  const readyCount = useMemo(() => documents.filter((doc) => doc.status === "ready").length, [documents]);
  const failedCount = useMemo(() => documents.filter((doc) => doc.status === "failed").length, [documents]);

  async function handleUploadFile(file: File) {
    setUploading(true);
    setUploadMessage(null);
    try {
      const result = await uploadWorkspaceManagedFile(workspace, file);

      if (!result.success || !result.sourceFileId || !result.gcsUri || !result.filename) {
        setUploadMessage(result.error?.message ?? "檔案上傳失敗");
        return;
      }

      setUploadMessage(`已上傳 ${result.filename}`);
      setProcessingTarget({
        sourceFileId: result.sourceFileId,
        filename: result.filename,
        gcsUri: result.gcsUri,
        mimeType: result.mimeType ?? "application/octet-stream",
        sizeBytes: result.sizeBytes ?? 0,
      });
      await reloadLibrary();
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "檔案上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteDocument(doc: WorkspaceManagedFileItem) {
    const confirmed = window.confirm(`確定要刪除 ${doc.name} 嗎？`);
    if (!confirmed) return;
    setBusyDocId(doc.id);
    try {
      const result = await deleteWorkspaceManagedFile(workspace, doc.id);
      if (!result.ok) {
        setUploadMessage(result.error.message);
        return;
      }
      setUploadMessage(`已刪除 ${doc.name}`);
      await reloadLibrary();
    } finally {
      setBusyDocId(null);
    }
  }

  async function handleRenameSave(doc: WorkspaceManagedFileItem) {
    if (!draftName.trim()) return;
    setBusyDocId(doc.id);
    try {
      const result = await renameWorkspaceManagedFile(workspace, doc.id, draftName.trim());
      if (!result.ok) {
        setUploadMessage(result.error.message);
        return;
      }
      setEditingDocId(null);
      setDraftName("");
      setUploadMessage(`已重新命名為 ${draftName.trim()}`);
      await reloadLibrary();
    } finally {
      setBusyDocId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Workspace Files</CardTitle>
              <CardDescription>
                以 workspace 為中心管理檔案資產，再依需要送往解析、知識頁面與任務流程。
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" onClick={() => void reloadLibrary()}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                重新整理
              </Button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                <Plus className="mr-1.5 h-4 w-4" />
                {uploading ? "上傳中…" : "新增檔案"}
                <input
                  type="file"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUploadFile(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">All files</p>
            <p className="mt-1 text-2xl font-semibold">{managedFileCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Ready for reuse</p>
            <p className="mt-1 text-2xl font-semibold">{readyCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Need attention</p>
            <p className="mt-1 text-2xl font-semibold">{failedCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardContent className="space-y-4 px-6 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <FileSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜尋檔案名稱或類型" className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "uploaded", "processing", "ready", "failed"] as const).map((value) => (
                <Button key={value} size="sm" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)}>
                  {value === "all" ? "全部" : value}
                </Button>
              ))}
            </div>
          </div>

          {uploadMessage ? (
            <p className="text-sm text-muted-foreground">{uploadMessage}</p>
          ) : null}

          {loadState === "loading" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> 載入檔案中…
            </div>
          ) : null}

          {loadState === "error" ? (
            <p className="text-sm text-destructive">無法載入檔案清單，請稍後再試。</p>
          ) : null}

          {loadState === "loaded" && filteredDocuments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/50 px-4 py-8 text-sm text-muted-foreground">
              目前沒有符合條件的檔案。你可以先上傳檔案，或改用其他篩選條件。
            </div>
          ) : null}

          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              const isEditing = editingDocId === doc.id;
              return (
                <div key={doc.id} className="rounded-xl border border-border/50 bg-card/70 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      {isEditing ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => void handleRenameSave(doc)} disabled={busyDocId === doc.id}>儲存</Button>
                            <Button size="sm" variant="outline" onClick={() => { setEditingDocId(null); setDraftName(""); }}>取消</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="truncate text-sm font-semibold text-foreground">{doc.name}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getStatusTone(doc.status)}>{doc.status}</Badge>
                        <Badge variant="outline">{doc.mimeType || "file"}</Badge>
                        <Badge variant="secondary">{formatFileSize(doc.sizeBytes)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.detail}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!doc.storagePath}
                        onClick={() => {
                          if (!doc.storagePath) return;
                          setProcessingTarget({
                            sourceFileId: doc.id,
                            filename: doc.name || doc.sourceFileName || "Untitled file",
                            gcsUri: toGsUri(doc.storagePath),
                            mimeType: doc.mimeType,
                            sizeBytes: doc.sizeBytes,
                          });
                        }}
                      >
                        <Wand2 className="mr-1.5 h-4 w-4" />
                        後續處理
                      </Button>
                      {doc.href ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={doc.href}>開啟檔案</Link>
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" onClick={() => { setEditingDocId(doc.id); setDraftName(doc.name); }}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        重新命名
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void handleDeleteDocument(doc)} disabled={busyDocId === doc.id}>
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        刪除
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {processingTarget ? (
        <FileProcessingDialog
          open
          onClose={() => setProcessingTarget(null)}
          accountId={workspace.accountId}
          workspaceId={workspace.id}
          sourceFileId={processingTarget.sourceFileId}
          filename={processingTarget.filename}
          gcsUri={processingTarget.gcsUri}
          mimeType={processingTarget.mimeType}
          sizeBytes={processingTarget.sizeBytes}
        />
      ) : null}
    </div>
  );
}
