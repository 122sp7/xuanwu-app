"use client";

/**
 * Route: /workspace-feed
 * Purpose: Workspace activity feed — shows posts, reactions, and replies for the
 *          currently active workspace.
 */

import { useApp } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api";

export default function WorkspaceFeedPage() {
  const { state: appState } = useApp();
  const { state: wsState } = useWorkspaceContext();
  const accountId = appState.activeAccount?.id ?? "";
  const workspaceId = wsState.activeWorkspaceId ?? "";
  const workspaceName = "工作區";

  if (!accountId || !workspaceId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        請先選擇工作區
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">動態牆</h1>
      <WorkspaceFeedWorkspaceView
        accountId={accountId}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </div>
  );
}
