"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { WorkspaceDetailRouteScreen } from "@/modules/workspace/api";

export default function AccountWorkspaceDetailPage() {
  const router = useRouter();
  const params = useParams<{ accountId: string; workspaceId: string }>();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";
  const isLegacyWorkspaceAlias = routeAccountId === "workspace";
  const initialTab = searchParams.get("tab") ?? undefined;
  const initialOverviewPanel = searchParams.get("panel") ?? undefined;

  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  const resolvedAccountId =
    (isLegacyWorkspaceAlias ? activeAccount?.id : routeAccountId) || activeAccount?.id;

  useEffect(() => {
    if (!isLegacyWorkspaceAlias || !activeAccount?.id || !workspaceId) {
      return;
    }

    const query = searchParams.toString();
    const targetPath = `/${encodeURIComponent(activeAccount.id)}/workspace/${encodeURIComponent(workspaceId)}`;
    router.replace(query.length > 0 ? `${targetPath}?${query}` : targetPath);
  }, [activeAccount?.id, isLegacyWorkspaceAlias, router, searchParams, workspaceId]);

  if (isLegacyWorkspaceAlias && activeAccount?.id && workspaceId) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        正在導向帳號工作區路由…
      </div>
    );
  }

  return (
    <WorkspaceDetailRouteScreen
      workspaceId={workspaceId}
      accountId={resolvedAccountId}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}