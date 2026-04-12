"use client";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";
import { KnowledgePageDetailPage } from "@/modules/notion/api";

export default function KnowledgePageDetailPageRoute() {
  const { accountId, activeWorkspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <KnowledgePageDetailPage
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId || null}
      currentUserId={currentUserId}
    />
  );
}
