"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";

export default function AiChatRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeAccount },
  } = useApp();
  const { state: wsState } = useWorkspaceContext();

  const accountId = activeAccount?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const workspaceId = requestedWorkspaceId || wsState.activeWorkspaceId || "";

  useEffect(() => {
    if (!accountId || !workspaceId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/ai-chat`,
    );
  }, [accountId, workspaceId, router]);

  return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向 AI Chat…</div>;
}
