"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { WikiBetaRagReindexView } from "@/modules/wiki-beta";

export default function WikiBetaRagReindexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId")?.trim() || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG Reindex</h1>
        <p className="text-sm text-muted-foreground">對文件執行手動重整，重新處理 chunk 與 embedding。</p>
      </header>

      <WikiBetaRagReindexView onBack={() => router.push("/wiki-beta")} workspaceId={workspaceId} />
    </div>
  );
}
