"use client";

import { ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";
import type { SourceLiveDocument } from "../hooks/useDocumentsSnapshot";
import { StatusBadge, RagBadge, formatDate } from "./source-document-status";

interface SourceDocumentRowProps {
  readonly doc: SourceLiveDocument;
  readonly deletingId: string | null;
  readonly renamingId: string | null;
  readonly onDelete: (doc: SourceLiveDocument) => void;
  readonly onRename: (doc: SourceLiveDocument) => void;
  readonly onViewOriginal: (doc: SourceLiveDocument) => void;
}

export function SourceDocumentRow({ doc, deletingId, renamingId, onDelete, onRename, onViewOriginal }: SourceDocumentRowProps) {
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-3 py-2.5">
        <p className="truncate font-medium text-foreground" title={doc.filename}>
          {doc.filename}
          {doc.isClientPending && (
            <span className="ml-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-700">
              pending
            </span>
          )}
        </p>
      </td>
      <td className="px-3 py-2.5"><StatusBadge doc={doc} /></td>
      <td className="px-3 py-2.5"><RagBadge doc={doc} /></td>
      <td className="px-3 py-2.5 text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onViewOriginal(doc)}
            disabled={!doc.sourceGcsUri}
            title="查看原始檔案"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <ExternalLink className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRename(doc)}
            disabled={renamingId === doc.id}
            title="更名"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            {renamingId === doc.id ? <Loader2 className="size-3.5 animate-spin" /> : <Pencil className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(doc)}
            disabled={deletingId === doc.id}
            title="刪除"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
          >
            {deletingId === doc.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </button>
        </div>
      </td>
    </tr>
  );
}
