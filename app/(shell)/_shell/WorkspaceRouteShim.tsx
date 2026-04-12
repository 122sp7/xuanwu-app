"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import {
  buildWorkspaceOverviewPanelHref,
  type WorkspaceOverviewPanel,
  useWorkspaceContext,
} from "@/modules/workspace/api";

interface WorkspaceRouteShimProps {
  readonly panel?: WorkspaceOverviewPanel;
  readonly tab?: "Overview" | "Files";
  readonly loadingMessage: string;
}

export function WorkspaceRouteShim({
  panel,
  tab = "Overview",
  loadingMessage,
}: WorkspaceRouteShimProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeAccount },
  } = useApp();
  const {
    state: { activeWorkspaceId },
  } = useWorkspaceContext();

  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const targetWorkspaceId = requestedWorkspaceId || activeWorkspaceId || "";
  const activeAccountId = activeAccount?.id ?? "";

  const targetHref = targetWorkspaceId
    ? activeAccountId
      ? tab === "Files"
        ? `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(targetWorkspaceId)}?tab=Files`
        : `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(targetWorkspaceId)}?tab=Overview${
            panel ? `&panel=${encodeURIComponent(panel)}` : ""
          }`
      : tab === "Files"
        ? `/workspace/${encodeURIComponent(targetWorkspaceId)}?tab=Files`
        : buildWorkspaceOverviewPanelHref(targetWorkspaceId, panel)
    : "/workspace";

  useEffect(() => {
    router.replace(targetHref);
  }, [router, targetHref]);

  return <div className="px-4 py-6 text-sm text-muted-foreground">{loadingMessage}</div>;
}
