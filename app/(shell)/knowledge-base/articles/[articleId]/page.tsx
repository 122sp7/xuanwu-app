"use client";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";
import { ArticleDetailPage } from "@/modules/notion/api";

export default function ArticleDetailPageRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <ArticleDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
