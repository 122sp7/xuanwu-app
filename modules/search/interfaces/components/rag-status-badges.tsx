"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function formatDate(value: Date | null): string {
  if (!value) return "-";
  return value.toLocaleString("zh-TW", { hour12: false });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (isRecord(error)) {
    const direct = error.message;
    if (typeof direct === "string" && direct.trim()) return direct;
    const nestedMessage = objectOrEmpty(error.details).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) return nestedMessage;
  }
  return "未知錯誤";
}

export function StatusBadge({ status, errorMessage }: { status: string; errorMessage: string }) {
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
        title={errorMessage || "未知錯誤"}
      >
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "-"}</span>;
}

export function RagBadge({ status, error }: { status: string; error: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={error || "未知錯誤"}
      >
        <XCircle className="size-3" /> Error
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
  return <span className="text-xs text-muted-foreground">-</span>;
}
