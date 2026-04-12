"use client";

import { useParams } from "next/navigation";

import { useWorkspaceContext } from "@/modules/workspace/api";
import { ConversationPanel } from "@/modules/notebooklm/api";

export default function AccountWorkspaceConversationPanel() {
  const params = useParams<{ accountId: string; workspaceId: string }>();
  const { state: wsState } = useWorkspaceContext();

  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  return (
    <ConversationPanel
      accountId={accountId}
      workspaces={wsState.workspaces ?? {}}
      requestedWorkspaceId={workspaceId}
    />
  );
}

