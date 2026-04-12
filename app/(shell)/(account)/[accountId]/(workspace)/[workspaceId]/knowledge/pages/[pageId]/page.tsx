"use client";

import { KnowledgeDetailPanel } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceKnowledgePageDetailRoute() {
  const { accountId, activeWorkspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <KnowledgeDetailPanel
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId || null}
      currentUserId={currentUserId}
    />
  );
}
