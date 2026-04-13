"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { WorkspaceDetailRouteScreen } from "@/modules/workspace/api";

export default function AccountWorkspaceDetailPage() {
  const params = useParams<{ accountId: string; workspaceId: string }>();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const initialTab = searchParams.get("tab") ?? undefined;
  const initialOverviewPanel = searchParams.get("panel") ?? undefined;

  const {
    state: { accountsHydrated },
  } = useApp();

  return (
    <WorkspaceDetailRouteScreen
      workspaceId={workspaceId}
      accountId={accountId}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}