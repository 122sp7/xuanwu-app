"use client";

import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";

import { cn } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";

import type { TaskResult } from "./file-processing-dialog.utils";

function formatFileSize(sizeBytes: number): string | null {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return null;

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let value = sizeBytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: value >= 10 || unitIndex === 0 ? 0 : 1,
  }).format(value)} ${units[unitIndex]}`;
}

export function FileProcessingPathValue({ value }: { readonly value: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-background/80">
      <div className="overflow-x-auto overscroll-x-contain px-3 py-2">
        <p className="min-w-max font-mono text-[11px] leading-5 text-muted-foreground" translate="no">
          {value}
        </p>
      </div>
    </div>
  );
}

export function FileProcessingSourceCard({
  filename,
  mimeType,
  gcsUri,
  sizeBytes,
}: {
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
}) {
  const fileSizeLabel = formatFileSize(sizeBytes);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground sm:text-base" translate="no">
              {filename}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal" translate="no">
                {mimeType || "application/octet-stream"}
              </Badge>
              {fileSizeLabel ? <Badge variant="secondary">{fileSizeLabel}</Badge> : null}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Source URI
            </p>
            <FileProcessingPathValue value={gcsUri} />
          </div>
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
  const meta = {
    running: {
      badgeLabel: "處理中",
      badgeVariant: "secondary" as const,
      icon: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
    success: {
      badgeLabel: "完成",
      badgeVariant: "outline" as const,
      icon: <CheckCircle2 className="size-4" aria-hidden="true" />,
      iconClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
    },
    error: {
      badgeLabel: "失敗",
      badgeVariant: "outline" as const,
      icon: <XCircle className="size-4" aria-hidden="true" />,
      iconClassName: "bg-destructive/10 text-destructive",
    },
    skipped: {
      badgeLabel: "略過",
      badgeVariant: "outline" as const,
      icon: <FileText className="size-4" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
    idle: {
      badgeLabel: "待命",
      badgeVariant: "secondary" as const,
      icon: <FileText className="size-4" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
  }[result.status];

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:gap-4 sm:p-5">
      <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", meta.iconClassName)}>
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground sm:text-base">{label}</p>
          <Badge variant={meta.badgeVariant}>{meta.badgeLabel}</Badge>
        </div>
        <p className="break-words text-xs leading-5 text-muted-foreground sm:text-sm">
          {result.detail}
        </p>
      </div>
    </div>
  );
}
