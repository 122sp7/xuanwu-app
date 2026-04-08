"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WorkspaceDetailRouteScreen } from "@/modules/workspace/api";

export default function WorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const initialTab = searchParams.get("tab") ?? undefined;
  const initialOverviewPanel = searchParams.get("panel") ?? undefined;
  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  return (
    <WorkspaceDetailRouteScreen
      workspaceId={workspaceId}
      accountId={activeAccount?.id}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
