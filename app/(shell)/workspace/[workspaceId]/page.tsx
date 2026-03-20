"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WorkspaceDetailScreen } from "@/modules/workspace";

export default function WorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const initialTab = searchParams.get("tab") ?? undefined;
  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={activeAccount?.id}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
    />
  );
}
