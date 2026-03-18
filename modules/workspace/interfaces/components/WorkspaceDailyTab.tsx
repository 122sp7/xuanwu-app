"use client";

import { useEffect, useMemo, useState } from "react";

import type { WorkspaceDailyDigestEntity } from "@/modules/daily";
import { getWorkspaceDailyDigest } from "@/modules/daily";
import type { WorkspaceEntity } from "@/modules/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Badge } from "@/ui/shadcn/ui/badge";

function formatNotificationTime(timestamp: number) {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "—";
  }
}

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  const [digest, setDigest] = useState<WorkspaceDailyDigestEntity | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadDailyFeed() {
      setLoadState("loading");

      try {
        const nextDigest = await getWorkspaceDailyDigest(workspace.id, workspace.accountId);
        if (cancelled) {
          return;
        }

        setDigest(nextDigest);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceDailyTab] Failed to load daily feed:", error);
        }

        if (!cancelled) {
          setDigest(null);
          setLoadState("error");
        }
      }
    }

    void loadDailyFeed();

    return () => {
      cancelled = true;
    };
  }, [workspace.accountId, workspace.id]);

  const dailyNotifications = useMemo(() => digest?.items ?? [], [digest]);

  const unreadCount = useMemo(() => digest?.summary.unread ?? 0, [digest]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Daily</CardTitle>
        <CardDescription>
          今日通知、提醒與工作區相關動態摘要。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Today items</p>
            <p className="mt-1 text-xl font-semibold">{digest?.summary.total ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Unread</p>
            <p className="mt-1 text-xl font-semibold">{unreadCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Recipient</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{workspace.accountId}</p>
          </div>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading daily feed…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入每日動態，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && dailyNotifications.length === 0 && (
          <p className="text-sm text-muted-foreground">
            今天尚未有新的工作區通知或動態紀錄。
          </p>
        )}

        {loadState === "loaded" && dailyNotifications.length > 0 && (
          <div className="space-y-3">
            {dailyNotifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-border/40 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <Badge variant="outline">{notification.type}</Badge>
                      {!notification.read && <Badge variant="secondary">Unread</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
