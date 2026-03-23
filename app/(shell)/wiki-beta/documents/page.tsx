"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WikiBetaRagTestView } from "@/modules/wiki-beta";

export default function WikiBetaDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const workspaceId = searchParams.get("workspaceId")?.trim() || appState.activeWorkspaceId || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">檢視 workspace-scoped documents 列表與解析狀態。</p>
      </header>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="documents" workspaceId={workspaceId} />
    </div>
  );
}
