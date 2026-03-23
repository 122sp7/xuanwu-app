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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文件</h1>
        <p className="text-sm text-muted-foreground">預設顯示帳號層級文件；可用 workspaceId 切換為工作區視角。</p>
      </header>

      <WikiBetaRagView onBack={() => router.push("/wiki-beta")} mode="documents" workspaceId={workspaceId} />
    </div>
  );
}
