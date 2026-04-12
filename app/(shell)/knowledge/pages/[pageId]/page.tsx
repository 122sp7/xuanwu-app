"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { useWorkspaceContext } from "@/modules/workspace/api";
import { KnowledgePageDetailPage } from "@/modules/notion/api";

export default function KnowledgePageDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: wsState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const activeWorkspaceId = wsState.activeWorkspaceId ?? null;
  const currentUserId = authState.user?.id ?? "";

  return (
    <KnowledgePageDetailPage
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId}
      currentUserId={currentUserId}
    />
  );
}
