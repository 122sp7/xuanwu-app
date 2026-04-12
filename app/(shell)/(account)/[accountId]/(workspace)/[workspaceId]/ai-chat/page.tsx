"use client";

import { useParams } from "next/navigation";

import { useWorkspaceContext } from "@/modules/workspace/api";
import { AiChatPage } from "@/modules/notebooklm/api";

export default function AccountWorkspaceAiChatPage() {
  const params = useParams<{ accountId: string; workspaceId: string }>();
  const { state: wsState } = useWorkspaceContext();

  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  return (
    <AiChatPage
      accountId={accountId}
      workspaces={wsState.workspaces ?? {}}
      requestedWorkspaceId={workspaceId}
    />
  );
}
