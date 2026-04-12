"use client";

import { KnowledgePageDetailScreen } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceKnowledgePageDetailRoute() {
  const { accountId, activeWorkspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <KnowledgePageDetailScreen
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId || null}
      currentUserId={currentUserId}
    />
  );
}
