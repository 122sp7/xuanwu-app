"use client";

import { useRouter } from "next/navigation";

import { WikiBetaRagTestView } from "@/modules/wiki-beta";

export default function WikiBetaRagReindexPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG Reindex</h1>
        <p className="text-sm text-muted-foreground">針對 account 下文件觸發 rag_reindex_document，驗證重整流程。</p>
      </header>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="reindex" />
    </div>
  );
}
