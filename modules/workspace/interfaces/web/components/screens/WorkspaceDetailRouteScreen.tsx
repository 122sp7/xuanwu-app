"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceDetailScreen } from "./WorkspaceDetailScreen";
import { resolveWorkspaceTabValue } from "../../navigation/workspace-tabs";

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string | null | undefined;
  accountsHydrated: boolean;
  initialTab?: string;
  initialOverviewPanel?: string;
}

function buildWorkspaceTabHref(
  accountId: string,
  workspaceId: string,
  tab: string,
  panel?: string,
): string {
  const params = new URLSearchParams();
  params.set("tab", tab);
  if (panel) {
    params.set("panel", panel);
  }

  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`;
}

export function WorkspaceDetailRouteScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailRouteScreenProps) {
  const router = useRouter();
  const normalizedInitialTab = resolveWorkspaceTabValue(initialTab);
  const shouldRedirectLegacyTab = Boolean(
    initialTab && normalizedInitialTab && normalizedInitialTab !== initialTab && accountId && workspaceId,
  );

  useEffect(() => {
    if (initialTab === "Wiki" && workspaceId) {
      if (accountId) {
        router.replace(buildWorkspaceTabHref(accountId, workspaceId, "Overview", "knowledge-pages"));
      }
      return;
    }

    if (shouldRedirectLegacyTab && normalizedInitialTab && accountId) {
      router.replace(
        buildWorkspaceTabHref(accountId, workspaceId, normalizedInitialTab, initialOverviewPanel),
      );
    }
  }, [
    accountId,
    initialOverviewPanel,
    initialTab,
    normalizedInitialTab,
    router,
    shouldRedirectLegacyTab,
    workspaceId,
  ]);

  if (initialTab === "Wiki" && workspaceId) {
    return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向工作區 Overview（Knowledge Pages）…</div>;
  }

  if (shouldRedirectLegacyTab) {
    return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向工作區新版分頁…</div>;
  }

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={accountId}
      accountsHydrated={accountsHydrated}
      initialTab={normalizedInitialTab ?? initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
