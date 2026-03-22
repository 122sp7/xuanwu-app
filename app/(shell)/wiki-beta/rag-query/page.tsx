"use client";

import { useRouter } from "next/navigation";

import { WikiBetaRagTestView } from "@/modules/wiki-beta";

export default function WikiBetaRagQueryPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG Query</h1>
        <p className="text-sm text-muted-foreground">使用 account-scoped context 驗證 rag_query 回答與引用。</p>
      </header>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="query" />
    </div>
  );
}
