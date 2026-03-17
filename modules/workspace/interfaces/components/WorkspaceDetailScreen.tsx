"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/ui/card";

import { getWorkspaceById } from "../queries/workspace.queries";

interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
}

export function WorkspaceDetailScreen({
  workspaceId,
  accountId,
  accountsHydrated,
}: WorkspaceDetailScreenProps) {
  const [workspace, setWorkspace] = useState<WorkspaceEntity | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!workspaceId) {
        setLoadState("error");
        return;
      }

      setLoadState("loading");
      try {
        const detail = await getWorkspaceById(workspaceId);
        if (cancelled) return;
        setWorkspace(detail);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceDetailScreen] Failed to load workspace:", error);
        }
        if (!cancelled) {
          setWorkspace(null);
          setLoadState("error");
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const accountMismatch = workspace && accountId && workspace.accountId !== accountId;

  return (
    <div className="space-y-4">
      <Link href="/workspace" className="text-sm font-medium text-primary hover:underline">
        ← 返回 Workspace Hub
      </Link>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Workspace Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!accountsHydrated && (
            <p className="text-sm text-muted-foreground">正在同步帳號內容…</p>
          )}

          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">Loading workspace detail…</p>
          )}

          {loadState === "error" && (
            <p className="text-sm text-destructive">
              無法載入工作區資料，請返回清單後重試。
            </p>
          )}

          {loadState === "loaded" && !workspace && (
            <p className="text-sm text-muted-foreground">找不到此工作區。</p>
          )}

          {accountMismatch && (
            <p className="text-sm text-destructive">此工作區不在目前帳號範圍內。</p>
          )}

          {workspace && !accountMismatch && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold">{workspace.name}</p>
                <Badge>{workspace.lifecycleState}</Badge>
                <Badge variant="outline">{workspace.visibility}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Account: {workspace.accountType} / {workspace.accountId}
              </p>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <span>Capabilities: {workspace.capabilities.length}</span>
                <span>Teams: {workspace.teamIds.length}</span>
                <span>Locations: {workspace.locations?.length ?? 0}</span>
                <span>Grants: {workspace.grants.length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
