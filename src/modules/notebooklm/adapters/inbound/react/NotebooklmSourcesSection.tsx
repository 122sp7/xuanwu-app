"use client";

/**
 * NotebooklmSourcesSection — notebooklm.sources tab — document source list + upload.
 * Uploads via Firebase Storage (py_fn Storage Trigger auto-runs parse + RAG).
 *
 * Closed-loop design: uploaded documents are the entry point of the data loop.
 * After upload → py_fn parses → RAG index → available in notebook/research → task formation.
 *
 * PDF/image preview: Google Doc Viewer renders Firebase Storage download URLs inline.
 */

import { Button } from "@packages";
import { Upload, RefreshCw, FileUp, ArrowRight, BookOpen, ListPlus, Eye, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import type { DocumentSnapshot } from "../../../subdomains/document/domain/entities/Document";
import { queryDocumentsAction, registerUploadedDocumentAction } from "../server-actions/document-actions";
import { uploadDocumentToStorage, getDocumentDownloadUrl } from "../../../adapters/outbound/firebase-composition";

interface NotebooklmSourcesSectionProps {
  workspaceId: string;
  accountId: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: "已就緒",
  processing: "處理中",
  archived: "已封存",
  deleted: "已刪除",
};

/** MIME types renderable via Google Doc Viewer */
const PREVIEWABLE_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
  "image/tif",
]);

function googleDocViewerUrl(downloadUrl: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
}

export function NotebooklmSourcesSection({
  workspaceId,
  accountId,
}: NotebooklmSourcesSectionProps): React.ReactElement {
  const [documents, setDocuments] = useState<DocumentSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview state
  const [previewDoc, setPreviewDoc] = useState<DocumentSnapshot | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const load = () => {
    startRefresh(async () => {
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  // Auto-load on mount so sources are visible without a manual click.
  useEffect(() => { load(); }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    startUpload(async () => {
      try {
        const path = await uploadDocumentToStorage(file, accountId, workspaceId);
        await registerUploadedDocumentAction({
          accountId,
          workspaceId,
          gcsPath: path,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        });
        // reload list after upload
        const result = await queryDocumentsAction({ accountId, workspaceId });
        setDocuments(Array.isArray(result) ? result : []);
        setLoaded(true);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "上傳失敗，請稍後再試。",
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const handlePreview = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setPreviewDoc(doc);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const url = await getDocumentDownloadUrl(doc.storageUrl);
      setPreviewUrl(url);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "無法取得預覽連結");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewDoc(null);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(false);
  };

  const isPending = isRefreshing || isUploading;
  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;

  const hasReadyDocs = documents.some((d) => d.status === "active");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">來源文件</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <FileUp className={`size-3.5 ${isUploading ? "animate-pulse" : ""}`} />
            {isUploading ? "上傳中…" : "上傳文件"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={load}
            disabled={isPending}
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            重新整理
          </Button>
        </div>
      </div>

      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.tiff"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {uploadError}
        </p>
      )}

      {!loaded && isRefreshing && (
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="size-3.5 animate-spin" />
          載入中…
        </p>
      )}

      {/* Processing chain banner — always visible once loaded */}
      {loaded && (
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-xs">
          <span className="shrink-0 text-muted-foreground font-medium">處理鏈：</span>
          <span className="shrink-0 rounded bg-orange-500/10 px-2 py-0.5 text-orange-600">① 上傳</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-blue-500/10 px-2 py-0.5 text-blue-600">② py_fn 解析</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-purple-500/10 px-2 py-0.5 text-purple-600">③ RAG 索引</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600">④ 就緒</span>
        </div>
      )}

      {loaded && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          尚無來源文件。請點擊「上傳文件」，或直接上傳至
          <code className="mx-1 rounded bg-muted px-1 text-xs">
            uploads/{"{accountId}"}/{"{workspaceId}"}/
          </code>
          前綴，py_fn Storage Trigger 會自動處理。
        </p>
      )}

      {loaded && documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-lg border border-border/40 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{doc.name}</span>
                <div className="flex items-center gap-2">
                  {doc.storageUrl && PREVIEWABLE_TYPES.has(doc.mimeType) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={() => void handlePreview(doc)}
                    >
                      <Eye className="size-3 mr-1" />
                      預覽
                    </Button>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs ${
                      doc.status === "active"
                        ? "bg-green-500/10 text-green-600"
                        : doc.status === "processing"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {STATUS_LABELS[doc.status] ?? doc.status}
                  </span>
                </div>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {doc.mimeType} · {(doc.sizeBytes / 1024).toFixed(1)} KB
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Downstream CTAs when documents are ready */}
      {loaded && hasReadyDocs && (
        <div className="flex flex-wrap gap-2 border-t border-border/30 pt-3">
          <p className="w-full text-xs text-muted-foreground">已就緒文件可用於：</p>
          <Link
            href={`${base}?tab=Notebook`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            RAG 查詢
          </Link>
          <Link
            href={`${base}?tab=Research`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            研究合成
          </Link>
          <Link
            href={`${base}?tab=TaskFormation`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
          >
            <ListPlus className="size-3.5" />
            任務形成
          </Link>
        </div>
      )}

      {/* PDF / image preview overlay — Google Doc Viewer */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`預覽：${previewDoc.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
          onKeyDown={(e) => { if (e.key === "Escape") closePreview(); }}
        >
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-xs">{previewDoc.name}</span>
                <span className="text-xs text-muted-foreground">{previewDoc.mimeType}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={closePreview} className="h-7 w-7 p-0">
                <X className="size-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-hidden">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {previewError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <p className="text-sm text-destructive">{previewError}</p>
                  <Button size="sm" variant="outline" onClick={() => void handlePreview(previewDoc)}>
                    重試
                  </Button>
                </div>
              )}
              {previewUrl && (
                <iframe
                  src={googleDocViewerUrl(previewUrl)}
                  className="h-full w-full border-0"
                  title={`預覽：${previewDoc.name}`}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
