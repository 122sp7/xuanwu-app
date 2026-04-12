"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { useWorkspaceContext } from "@/modules/workspace/api";
import { DatabaseDetailPage } from "@/modules/notion/api";

export default function DatabaseDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: wsState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = wsState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <DatabaseDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
