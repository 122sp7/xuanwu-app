"use client";

import { DatabaseFormsPanel } from "@/modules/workspace/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceDatabaseFormsPanelRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <DatabaseFormsPanel
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}

