"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationWorkspacesPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    const organizationId: string = activeOrganizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getWorkspacesForAccount(organizationId);
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
        <h1 className="text-2xl font-bold tracking-tight">工作區</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          組織下所有工作區清單，含 lifecycle 狀態與快速連結。
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <CardDescription>組織下所有工作區清單，含 lifecycle 狀態與快速連結。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">工作區載入中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">無法載入工作區資料，請稍後再試。</p>
          )}
          {loadState === "loaded" && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區。</p>
          )}
          {loadState === "loaded" &&
            workspaces.map((workspace) => (
              <div key={workspace.id} className="rounded-lg border border-border/40 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="link" className="h-auto p-0 text-sm font-medium">
                      <Link href={`/workspace/${workspace.id}`}>{workspace.name}</Link>
                    </Button>
                    <Badge
                      variant={
                        workspace.lifecycleState === "active"
                          ? "default"
                          : workspace.lifecycleState === "preparatory"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {workspace.lifecycleState}
                    </Badge>
                    <Badge variant="outline">{workspace.visibility}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/workspace/${workspace.id}?tab=Files`}>檔案</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/workspace/${workspace.id}?tab=Wiki`}>WorkSpace Wiki-Beta</Link>
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{workspace.id}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
