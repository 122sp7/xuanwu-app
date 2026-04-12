"use client";

import { ArticleDetailScreen } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceArticleDetailPageRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <ArticleDetailScreen
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
