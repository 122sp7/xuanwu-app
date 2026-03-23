"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { WikiBetaRagView } from "@/modules/wiki-beta";

export default function WikiBetaDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId")?.trim() || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">預設檢視 account-scoped documents；可用 workspaceId 進行視角篩選。</p>
      </header>

      <WikiBetaRagView onBack={() => router.push("/wiki-beta")} mode="documents" workspaceId={workspaceId} />
    </div>
  );
}
