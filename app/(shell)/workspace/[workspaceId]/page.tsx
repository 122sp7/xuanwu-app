"use client";

import { useParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WorkspaceDetailScreen } from "@/modules/workspace";

export default function WorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={activeAccount?.id}
      accountsHydrated={accountsHydrated}
    />
  );
}
