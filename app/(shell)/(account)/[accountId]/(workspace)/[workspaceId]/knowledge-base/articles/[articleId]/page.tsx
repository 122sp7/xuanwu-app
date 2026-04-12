"use client";

import { ArticleDetailPanel } from "@/modules/workspace/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceArticleDetailPanelRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <ArticleDetailPanel
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}

