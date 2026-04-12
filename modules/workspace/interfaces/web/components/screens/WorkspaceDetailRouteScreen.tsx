"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceDetailScreen } from "./WorkspaceDetailScreen";

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string | null | undefined;
  accountsHydrated: boolean;
  initialTab?: string;
  initialOverviewPanel?: string;
}

export function WorkspaceDetailRouteScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailRouteScreenProps) {
  const router = useRouter();

  useEffect(() => {
    if (initialTab === "Wiki" && workspaceId) {
      router.replace(`/workspace/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-pages`);
    }
  }, [initialTab, router, workspaceId]);

  if (initialTab === "Wiki" && workspaceId) {
    return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向工作區 Overview（Knowledge Pages）…</div>;
  }

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={accountId}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
