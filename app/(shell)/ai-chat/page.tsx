"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
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
