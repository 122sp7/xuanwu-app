"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { WorkspaceDetailScreen } from "@/modules/workspace/api";

export default function WorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const initialTab = searchParams.get("tab") ?? undefined;
  const initialOverviewPanel = searchParams.get("panel") ?? undefined;
  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  useEffect(() => {
    if (initialTab === "Wiki" && workspaceId) {
      router.replace(`/knowledge/pages?workspaceId=${encodeURIComponent(workspaceId)}`);
    }
  }, [initialTab, router, workspaceId]);

  if (initialTab === "Wiki" && workspaceId) {
    return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向工作區知識頁面…</div>;
  }

  return (
    <WorkspaceDetailScreen
      workspaceId={workspaceId}
      accountId={activeAccount?.id}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
