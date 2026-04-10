"use client";

import { useSearchParams } from "next/navigation";

import { useApp, useAuth } from "@/modules/platform/api"
import { AiChatPage } from "@/modules/notebooklm/api";

export default function AiChatRoutePage() {
  const searchParams = useSearchParams();
  const { state: { workspaces } } = useApp();
  const { state: authState } = useAuth();
  const accountId = authState.user?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  return (
    <AiChatPage
      accountId={accountId}
      workspaces={workspaces ?? {}}
      requestedWorkspaceId={requestedWorkspaceId}
    />
  );
}
