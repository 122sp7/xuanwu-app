"use client";

import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import type { TaskResult } from "./file-processing-dialog.utils";

export function FileProcessingSourceCard({
  filename,
  mimeType,
  gcsUri,
}: {
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <FileText className="size-4" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold text-foreground">{filename}</p>
          <p className="text-xs text-muted-foreground">{mimeType || "application/octet-stream"}</p>
          <p className="break-all text-xs text-muted-foreground">{gcsUri}</p>
        </div>
      </div>
    </div>
  );
}

export function FileProcessingResultRow({
  label,
  result,
}: {
  readonly label: string;
  readonly result: TaskResult;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/40 px-3 py-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{result.detail}</p>
      </div>
      {result.status === "running" && <Loader2 className="mt-0.5 size-4 animate-spin text-muted-foreground" />}
      {result.status === "success" && <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />}
      {result.status === "error" && <XCircle className="mt-0.5 size-4 text-destructive" />}
      {result.status === "skipped" && <Badge variant="outline">Skipped</Badge>}
      {result.status === "idle" && <Badge variant="secondary">Pending</Badge>}
    </div>
  );
}