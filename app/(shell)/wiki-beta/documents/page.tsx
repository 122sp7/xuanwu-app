"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WikiBetaRagTestView } from "@/modules/wiki-beta";

export default function WikiBetaDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeWorkspaceId },
  } = useApp();
  const workspaceId = searchParams.get("workspaceId")?.trim() || "";

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">檢視 account-scoped documents 狀態，用於確認 ingest/reindex 結果。</p>
        {workspaceId ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 px-2 py-1">workspace: {workspaceId}</span>
            <Link href="/wiki-beta/documents" className="text-primary hover:underline">
              清除篩選
            </Link>
          </div>
        ) : activeWorkspaceId ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 px-2 py-1">目前顯示：全部 workspace</span>
            <Link href={`/wiki-beta/documents?workspaceId=${encodeURIComponent(activeWorkspaceId)}`} className="text-primary hover:underline">
              改看目前工作區
            </Link>
          </div>
        ) : null}
      </header>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="documents" workspaceId={workspaceId} />
    </div>
  );
}
