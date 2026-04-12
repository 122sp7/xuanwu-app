"use client";

import { ArticleDetailPage } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceArticleDetailPageRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <ArticleDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
