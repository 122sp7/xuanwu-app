"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { resolveWorkspaceFromMap } from "@/modules/workspace/api";
import { RagQueryView } from "@/modules/notebooklm/api";

export default function NotebookRagQueryPage() {
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const resolvedWorkspace = resolveWorkspaceFromMap(appState.workspaces, requestedWorkspaceId);
  const workspaceId = resolvedWorkspace?.id ?? appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Notebook</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG 查詢</h1>
        <p className="text-sm text-muted-foreground">使用工作區脈絡執行查詢，並檢視回答與引用來源。</p>
      </header>

      <RagQueryView workspaceId={workspaceId} />
    </div>
  );
}
