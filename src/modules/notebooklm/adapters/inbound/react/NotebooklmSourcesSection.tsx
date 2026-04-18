"use client";

/**
 * NotebooklmSourcesSection — notebooklm.sources tab — document source list + upload.
 * Uploads via Firebase Storage (py_fn Storage Trigger auto-runs parse + RAG).
 */

import { Upload, RefreshCw, FileUp } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { DocumentSnapshot } from "../../../subdomains/document/domain/entities/Document";
import { queryDocumentsAction, registerUploadedDocumentAction } from "../server-actions/document-actions";
import { uploadDocumentToStorage } from "../../../adapters/outbound/firebase-composition";

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

  const load = () => {
    startRefresh(async () => {
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

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

  const isPending = isRefreshing || isUploading;

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
            {loaded ? "重新整理" : "載入"}
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

      {!loaded && (
        <p className="text-sm text-muted-foreground">
          點擊「載入」查看已上傳的來源文件。上傳後 py_fn 會自動執行解析與向量索引。
        </p>
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
              <p className="mt-0.5 text-xs text-muted-foreground">
                {doc.mimeType} · {(doc.sizeBytes / 1024).toFixed(1)} KB
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) as React.ReactElement;
}
