"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { resolveWorkspaceFromMap } from "@/modules/workspace/api";
import { WorkspaceFilesTab } from "@/modules/notebooklm/api";

export default function SourceDocumentsPage() {
  const searchParams = useSearchParams();
  const {
    state: { workspaces, activeWorkspaceId },
  } = useApp();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";

  // Prefer explicit workspaceId from URL; fall back to the currently active workspace.
  const workspace =
    resolveWorkspaceFromMap(workspaces, requestedWorkspaceId) ??
    (activeWorkspaceId ? workspaces[activeWorkspaceId] ?? null : null);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Source</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文件</h1>
        <p className="text-sm text-muted-foreground">管理工作區的來源文件。</p>
      </header>

      {workspace ? (
        <WorkspaceFilesTab workspace={workspace} />
      ) : (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          請先選擇工作區，再管理來源文件。你可以從側邊欄切換工作區，或在網址帶入{" "}
          <code className="rounded bg-muted px-1">workspaceId</code> 參數。
        </p>
      )}
    </div>
  );
}
