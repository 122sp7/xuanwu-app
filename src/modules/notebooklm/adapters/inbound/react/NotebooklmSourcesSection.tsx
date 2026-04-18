"use client";

/**
 * NotebooklmSourcesSection — notebooklm.sources tab — document source list.
 * Shows all documents ingested via py_fn Storage Trigger.
 */

import { Upload, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { DocumentSnapshot } from "../../../subdomains/document/domain/entities/Document";
import { queryDocumentsAction } from "../server-actions/document-actions";

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
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">來源文件</h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={load}
          disabled={isPending}
        >
          <RefreshCw className={`size-3.5 ${isPending ? "animate-spin" : ""}`} />
          {loaded ? "重新整理" : "載入"}
        </Button>
      </div>

      {!loaded && (
        <p className="text-sm text-muted-foreground">
          點擊「載入」查看已上傳的來源文件。上傳後 py_fn 會自動執行解析與向量索引。
        </p>
      )}

      {loaded && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          尚無來源文件。請透過 Firebase Storage 上傳至
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
