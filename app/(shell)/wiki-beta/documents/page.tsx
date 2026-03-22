"use client";

import { useRouter } from "next/navigation";

import { WikiBetaRagTestView } from "@/modules/wiki-beta";

export default function WikiBetaDocumentsPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">檢視 account-scoped documents 狀態，用於確認 ingest/reindex 結果。</p>
      </header>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="documents" />
    </div>
  );
}
