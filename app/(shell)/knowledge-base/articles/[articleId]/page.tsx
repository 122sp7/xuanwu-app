"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { ArticleDetailPage } from "@/modules/notion/api";

export default function ArticleDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <ArticleDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
