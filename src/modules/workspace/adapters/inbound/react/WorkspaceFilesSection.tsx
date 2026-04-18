"use client";

/**
 * WorkspaceFilesSection — workspace.files tab — file management.
 *
 * Upload flow:
 *   1. Browser picks a file via hidden <input type="file">.
 *   2. uploadWorkspaceFile() sends it to Firebase Storage (client-side).
 *   3. registerUploadedFileAction() saves metadata to Firestore (server action).
 *   4. listWorkspaceFilesAction() loads the list on mount / after upload.
 *
 * Delete flow:
 *   1. deleteWorkspaceFileAction() soft-deletes the Firestore record (sets deletedAtISO).
 *      The Storage object is kept for safety (GCS lifecycle rules handle eventual removal).
 */

import { Badge, Button } from "@packages";
import { FolderOpen, Upload, Grid2x2, List, Trash2, FileText, Image, File, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { uploadWorkspaceFile } from "@/src/modules/platform";
import {
  listWorkspaceFilesAction,
  registerUploadedFileAction,
  deleteWorkspaceFileAction,
} from "@/src/modules/platform/adapters/inbound/server-actions/file-actions";
import type { StoredFile } from "@/src/modules/platform";

interface WorkspaceFilesSectionProps {
  workspaceId: string;
  accountId: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fileCategoryIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <Image className="size-3.5 text-blue-500" />;
  if (
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/") ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation")
  )
    return <FileText className="size-3.5 text-orange-500" />;
  return <File className="size-3.5 text-muted-foreground" />;
}

function categoryCounts(files: StoredFile[]) {
  const docs = files.filter(
    (f) =>
      f.mimeType === "application/pdf" ||
      f.mimeType.startsWith("text/") ||
      f.mimeType.includes("document") ||
      f.mimeType.includes("spreadsheet") ||
      f.mimeType.includes("presentation"),
  ).length;
  const imgs = files.filter((f) => f.mimeType.startsWith("image/")).length;
  return { all: files.length, docs, imgs, other: files.length - docs - imgs };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WorkspaceFilesSection({
  workspaceId,
  accountId,
}: WorkspaceFilesSectionProps): React.ReactElement {
  const [view, setView] = useState<"grid" | "list">("list");
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, startRefresh] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    startRefresh(async () => {
      const result = await listWorkspaceFilesAction({ workspaceId });
      setFiles(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  // Auto-load on mount so files are visible without a manual click.
  useEffect(() => { load(); }, [workspaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    startUpload(async () => {
      try {
        const storagePath = await uploadWorkspaceFile(file, accountId, workspaceId);
        await registerUploadedFileAction({
          workspaceId,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          url: storagePath,
        });
        const result = await listWorkspaceFilesAction({ workspaceId });
        setFiles(Array.isArray(result) ? result : []);
        setLoaded(true);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "上傳失敗，請稍後再試。");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId);
    try {
      await deleteWorkspaceFileAction({ fileId });
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "刪除失敗，請稍後再試。");
    } finally {
      setDeletingId(null);
    }
  };

  const isPending = isRefreshing || isUploading;
  const counts = categoryCounts(files);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">檔案</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            <List className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <Grid2x2 className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" />
            )}
            {isUploading ? "上傳中…" : "上傳"}
          </Button>
          <Button size="sm" variant="ghost" onClick={load} disabled={isPending}>
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            重新整理
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Error banner */}
      {uploadError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {uploadError}
        </p>
      )}

      {/* Storage summary */}
      {loaded && (
        <div className="flex flex-wrap gap-2">
          {[
            { label: "全部", count: counts.all },
            { label: "文件", count: counts.docs },
            { label: "圖片", count: counts.imgs },
            { label: "其他", count: counts.other },
          ].map((cat) => (
            <Badge key={cat.label} variant="outline" className="text-xs">
              {cat.label} ({cat.count})
            </Badge>
          ))}
        </div>
      )}

      {/* Loading indicator before first load */}
      {!loaded && isRefreshing && (
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="size-3.5 animate-spin" />
          載入中…
        </p>
      )}

      {/* Empty state */}
      {loaded && files.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/20 px-4 py-10 text-center">
          <FolderOpen className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無檔案</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            點擊「上傳」按鈕將檔案新增至此工作區。
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <Upload className="size-3.5" />
            上傳檔案
          </Button>
        </div>
      )}

      {/* File list */}
      {loaded && files.length > 0 && view === "list" && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.fileId}
              className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                {fileCategoryIcon(file.mimeType)}
                <span className="truncate font-medium">{file.fileName}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">{formatBytes(file.sizeBytes)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  disabled={deletingId === file.fileId}
                  onClick={() => void handleDelete(file.fileId)}
                  aria-label="刪除檔案"
                >
                  {deletingId === file.fileId ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* File grid */}
      {loaded && files.length > 0 && view === "grid" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.fileId}
              className="rounded-xl border border-border/40 bg-card/30 p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-1.5">
                {fileCategoryIcon(file.mimeType)}
                <span className="text-xs font-medium truncate flex-1">{file.fileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatBytes(file.sizeBytes)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  disabled={deletingId === file.fileId}
                  onClick={() => void handleDelete(file.fileId)}
                  aria-label="刪除檔案"
                >
                  {deletingId === file.fileId ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
