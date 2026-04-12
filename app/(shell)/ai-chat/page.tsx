"use client";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";
import { AiChatPage } from "@/modules/notebooklm/api";

export default function AiChatRoutePage() {
  const searchParams = useSearchParams();
  const { state: wsState } = useWorkspaceContext();
  const { state: authState } = useAuth();
  const accountId = authState.user?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  return (
    <AiChatPage
      accountId={accountId}
      workspaces={wsState.workspaces ?? {}}
      requestedWorkspaceId={requestedWorkspaceId}
    />
  );
}
