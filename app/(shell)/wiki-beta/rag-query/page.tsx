"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WikiBetaRagQueryView } from "@/modules/wiki-beta";

export default function WikiBetaRagQueryPage() {
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const workspaceId = searchParams.get("workspaceId")?.trim() || appState.activeWorkspaceId || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG 查詢</h1>
        <p className="text-sm text-muted-foreground">使用工作區脈絡執行查詢，並檢視回答與引用來源。</p>
      </header>

      <WikiBetaRagQueryView workspaceId={workspaceId} />
    </div>
  );
}
