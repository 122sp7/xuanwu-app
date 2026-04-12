"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    state: { activeWorkspaceId },
  } = useWorkspaceContext();

  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const targetWorkspaceId = requestedWorkspaceId || activeWorkspaceId || "";

  const targetHref = targetWorkspaceId
    ? tab === "Files"
      ? `/workspace/${encodeURIComponent(targetWorkspaceId)}?tab=Files`
      : buildWorkspaceOverviewPanelHref(targetWorkspaceId, panel)
    : "/workspace";

  useEffect(() => {
    router.replace(targetHref);
  }, [router, targetHref]);

  return <div className="px-4 py-6 text-sm text-muted-foreground">{loadingMessage}</div>;
}
