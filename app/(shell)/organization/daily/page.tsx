"use client";

import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import type { DailyFeedItem, OrganizationDailyDigestEntity } from "@/modules/daily";
import { getOrganizationDailyDigest, getOrganizationDailyFeed } from "@/modules/daily";
import type { WorkspaceEntity } from "@/modules/workspace";
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

const DAILY_ENTRY_TYPE_LABEL: Record<DailyFeedItem["entryType"], string> = {
  update: "更新",
  blocker: "阻塞",
  ask: "協作需求",
  milestone: "里程碑",
  signal: "系統訊號",
  story: "限時動態",
  highlight: "精選",
};

function formatDateTime(iso: string) {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) {
    return "—";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function OrganizationDailyPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [digest, setDigest] = useState<OrganizationDailyDigestEntity | null>(null);
  const [feed, setFeed] = useState<readonly DailyFeedItem[]>([]);
  const [workspaces, setWorkspaces] = useState<readonly WorkspaceEntity[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) {
      return;
    }

    const organizationId = activeOrganizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const nextWorkspaces = await getWorkspacesForAccount(organizationId);
        const workspaceIds = nextWorkspaces.map((workspace) => workspace.id);
        const [nextFeed, nextDigest] = await Promise.all([
          getOrganizationDailyFeed(organizationId, workspaceIds),
          getOrganizationDailyDigest(organizationId, workspaceIds),
        ]);

        if (!cancelled) {
          setWorkspaces(nextWorkspaces);
          setFeed(nextFeed);
          setDigest(nextDigest);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setDigest(null);
          setFeed([]);
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

  const workspaceNames = useMemo(
    () => new Map(workspaces.map((workspace) => [workspace.id, workspace.name] as const)),
    [workspaces],
  );

  const digestItems = useMemo(() => digest?.items ?? [], [digest]);

  if (!activeOrganizationId) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">每日</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          目前以 organization canonical Daily feed 為標準；通知 digest 僅保留為遷移期間的相容對照。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Canonical entries</p>
          <p className="mt-1 text-xl font-semibold">{feed.length}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Digest items (compat)</p>
          <p className="mt-1 text-xl font-semibold">{digest?.summary.total ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Unread digest (compat)</p>
          <p className="mt-1 text-xl font-semibold">{digest?.summary.unread ?? 0}</p>
        </div>
      </div>

      {loadState === "loading" && (
        <p className="text-sm text-muted-foreground">載入 Daily feed 中…</p>
      )}

      {loadState === "error" && (
        <p className="text-sm text-destructive">讀取組織 Daily 失敗，請稍後重新整理頁面。</p>
      )}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Workspace Daily Feed</CardTitle>
          <CardDescription>依工作區整理 canonical Daily 條目；目前排序仍為 freshness-only。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loaded" && feed.length === 0 && (
            <p className="text-sm text-muted-foreground">今天還沒有新的 Workspace Daily 發布。</p>
          )}

          {feed.map((entry) => (
            <div key={entry.entryId} className="rounded-lg border border-border/40 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                    <Badge variant="outline">{DAILY_ENTRY_TYPE_LABEL[entry.entryType]}</Badge>
                    {entry.rankReason.map((reason) => (
                      <Badge key={reason} variant="secondary">
                        {reason === "freshness" ? "最新發布" : reason}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                  {entry.body && <p className="text-sm text-foreground/90">{entry.body}</p>}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{workspaceNames.get(entry.workspaceId) ?? "未知工作區"}</span>
                    <span>•</span>
                    <span>{formatDateTime(entry.publishedAtISO)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Digest compatibility</CardTitle>
          <CardDescription>既有通知驅動摘要僅作相容對照，並非目前 Daily 的主標準。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loaded" && digestItems.length === 0 && (
            <p className="text-sm text-muted-foreground">今天沒有新的組織通知摘要。</p>
          )}
          {loadState === "loaded" &&
            digestItems.map((notification) => (
              <div key={notification.id} className="rounded-lg border border-border/40 px-3 py-2">
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
