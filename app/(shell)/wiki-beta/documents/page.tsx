"use client";

import { useSearchParams } from "next/navigation";

import { WikiBetaDocumentsView, WikiBetaShell } from "@/modules/wiki-beta";

export default function WikiBetaDocumentsPage() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId")?.trim() || undefined;

  return (
    <WikiBetaShell>
      <WikiBetaDocumentsView workspaceId={workspaceId} />
    </WikiBetaShell>
  );
}
