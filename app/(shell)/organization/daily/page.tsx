"use client";

import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import type { OrganizationDailyDigestEntity } from "@/modules/daily";
import { getOrganizationDailyDigest } from "@/modules/daily";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationDailyPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [digest, setDigest] = useState<OrganizationDailyDigestEntity | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;
    const organizationId = activeOrganizationId;

    async function load() {
      setLoadState("loading");
      try {
        const workspaces = await getWorkspacesForAccount(organizationId);
        const data = await getOrganizationDailyDigest(organizationId, workspaces.map((w) => w.id));
        if (!cancelled) {
          setDigest(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setDigest(null);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  const todayFeed = useMemo(() => digest?.items ?? [], [digest]);

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
        <h1 className="text-2xl font-bold tracking-tight">每日</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織層級今日通知與活動摘要。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Daily</CardTitle>
          <CardDescription>組織層級今日通知與活動摘要。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入每日摘要中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取每日摘要失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && todayFeed.length === 0 && (
            <p className="text-sm text-muted-foreground">今天沒有新的組織動態。</p>
          )}
          {loadState === "loaded" &&
            todayFeed.map((notification) => (
              <div
                key={notification.id}
                className="rounded-lg border border-border/40 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <Badge variant="outline">{notification.type}</Badge>
                  {!notification.read && <Badge variant="secondary">Unread</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
