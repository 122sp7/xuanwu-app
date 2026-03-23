"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WikiBetaRagView } from "@/modules/wiki-beta";

export default function WikiBetaRagQueryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const workspaceId = searchParams.get("workspaceId")?.trim() || appState.activeWorkspaceId || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG Query</h1>
        <p className="text-sm text-muted-foreground">使用 workspace-scoped context 執行 rag_query 並檢視回答與引用。</p>
      </header>

      <WikiBetaRagView onBack={() => router.push("/wiki-beta")} mode="query" workspaceId={workspaceId} />
    </div>
  );
}
