"use client";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";
import { DatabaseFormsPage } from "@/modules/notion/api";

export default function DatabaseFormsPageRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <DatabaseFormsPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
