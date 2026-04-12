"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { useWorkspaceContext } from "@/modules/workspace/api";
import { DatabaseFormsPage } from "@/modules/notion/api";

export default function DatabaseFormsPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: wsState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = wsState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <DatabaseFormsPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
