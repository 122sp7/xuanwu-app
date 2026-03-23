"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WikiBetaRagQueryView, WikiBetaShell } from "@/modules/wiki-beta";

export default function WikiBetaRagQueryPage() {
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const workspaceId = searchParams.get("workspaceId")?.trim() || appState.activeWorkspaceId || undefined;

  return (
    <WikiBetaShell>
      <WikiBetaRagQueryView workspaceId={workspaceId} />
    </WikiBetaShell>
  );
}
