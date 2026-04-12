"use client";

/**
 * Route: /workspace-feed
 * Purpose: Workspace activity feed — shows posts, reactions, and replies for the
 *          currently active workspace.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";

export default function WorkspaceFeedPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: wsState } = useWorkspaceContext();
  const accountId = appState.activeAccount?.id ?? "";
  const workspaceId = wsState.activeWorkspaceId ?? "";

  useEffect(() => {
    if (!accountId || !workspaceId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/workspace-feed`,
    );
  }, [accountId, workspaceId, router]);

  if (!accountId || !workspaceId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        請先選擇工作區
      </div>
    );
  }

  return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向 Workspace Feed…</div>;
}
