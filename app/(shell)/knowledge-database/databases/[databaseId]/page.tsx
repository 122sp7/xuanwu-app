"use client";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";
import { DatabaseDetailPage } from "@/modules/notion/api";

export default function DatabaseDetailPageRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <DatabaseDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
