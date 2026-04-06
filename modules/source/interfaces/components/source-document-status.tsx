"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import type { SourceLiveDocument } from "../hooks/useDocumentsSnapshot";

export function formatDate(value: Date | null): string {
  if (!value) return "-";
  return value.toLocaleString("zh-TW", { hour12: false });
}

export function StatusBadge({ doc }: { doc: SourceLiveDocument }) {
  if (doc.status === "completed") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
        <CheckCircle2 className="size-3" /> ✓ ready
      </Badge>
    );
  }
  if (doc.status === "processing") {
    return (
      <Badge variant="outline" className="gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700">
        <Loader2 className="size-3 animate-spin" /> ⏳ processing
      </Badge>
    );
  }
  if (doc.status === "error") {
    return (
      <Badge variant="outline" className="gap-1 border-destructive/40 bg-destructive/10 text-destructive" title={doc.errorMessage || "未知錯誤"}>
        <XCircle className="size-3" /> ✗ error
      </Badge>
    );
  }
  return <Badge variant="outline">{doc.status || "unknown"}</Badge>;
}

export function RagBadge({ doc }: { doc: SourceLiveDocument }) {
  if (doc.ragStatus === "ready") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
        <CheckCircle2 className="size-3" /> indexed
      </Badge>
    );
  }
  if (doc.ragStatus === "error") {
    return (
      <Badge variant="outline" className="gap-1 border-destructive/40 bg-destructive/10 text-destructive" title={doc.ragError || "未知錯誤"}>
        <XCircle className="size-3" /> rag error
      </Badge>
    );
  }
  if (doc.ragStatus) {
    return (
      <Badge variant="outline" className="gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700">
        <Loader2 className="size-3 animate-spin" /> {doc.ragStatus}
      </Badge>
    );
  }
  return <span className="text-xs text-muted-foreground">-</span>;
}
