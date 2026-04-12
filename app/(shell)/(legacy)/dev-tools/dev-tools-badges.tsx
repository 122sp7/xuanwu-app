"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function StatusBadge({ status, errorMessage }: { status: string; errorMessage?: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> 完成
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> 處理中
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={errorMessage}
      >
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "—"}</span>;
}

export function RagBadge({ status, error }: { status?: string; error?: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> RAG Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={error}
      >
        <XCircle className="size-3" /> RAG Error
      </span>
    );
  }
  if (status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> {status}
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">—</span>;
}
