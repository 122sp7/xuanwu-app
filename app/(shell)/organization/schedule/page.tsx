"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { formatDateTime, isOrganizationAccount } from "../_utils";

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getWorkspacesForAccount(activeOrganizationId);
        if (!cancelled) {
          setWorkspaces(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setWorkspaces([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  if (!activeOrganizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">排程</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          組織下各工作區的 lifecycle / milestone 排程總覽。
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>組織下各工作區的 lifecycle / milestone 排程總覽。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入排程資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取排程資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區排程資料。</p>
          )}
          {loadState === "loaded" &&
            workspaces.map((workspace) => (
              <div key={workspace.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{workspace.name}</p>
                  <Badge variant="outline">{workspace.lifecycleState}</Badge>
                  <Badge variant="secondary">{workspace.visibility}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created: {formatDateTime(workspace.createdAt?.toDate() ?? null)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
