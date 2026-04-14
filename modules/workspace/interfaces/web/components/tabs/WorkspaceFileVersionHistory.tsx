"use client";

import { Badge } from "@ui-shadcn/ui/badge";

import type { WorkspaceManagedFileVersionItem } from "@/modules/workspace/api/facade";

function formatVersionDate(value: string): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

interface WorkspaceFileVersionHistoryProps {
  readonly loadState: "idle" | "loading" | "loaded" | "error" | undefined;
  readonly versions: readonly WorkspaceManagedFileVersionItem[];
  readonly getStatusTone: (status: string) => "default" | "secondary" | "outline";
}

export function WorkspaceFileVersionHistory({
  loadState,
  versions,
  getStatusTone,
}: WorkspaceFileVersionHistoryProps) {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-border/50 px-3 py-3">
      {loadState === "loading" ? (
        <p className="text-xs text-muted-foreground">載入版本歷史中…</p>
      ) : null}
      {loadState === "error" ? (
        <p className="text-xs text-destructive">無法載入版本歷史。</p>
      ) : null}
      {(loadState === "loaded" || loadState == null || loadState === "idle") && (
        <div className="space-y-2">
          {versions.length === 0 ? (
            <p className="text-xs text-muted-foreground">目前尚無可顯示的版本快照。</p>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="flex flex-col gap-1 rounded-lg border border-border/40 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">v{version.versionNumber}</Badge>
                  <Badge variant={getStatusTone(version.status)}>{version.status}</Badge>
                </div>
                <p className="text-muted-foreground">{formatVersionDate(version.createdAtISO)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
