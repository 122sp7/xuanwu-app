"use client";

import { useEffect, useMemo, useState } from "react";

import type { NotificationEntity } from "@/modules/notification";
import type { WorkspaceEntity } from "@/modules/workspace";
import { getNotificationsForRecipient } from "@/modules/notification/interfaces/queries/notification.queries";
import { getWorkspaceIssueSignals } from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceIssueTabProps {
  readonly workspace: WorkspaceEntity;
}

const severityVariantMap = {
  low: "outline",
  medium: "secondary",
  high: "default",
} as const;

export function WorkspaceIssueTab({ workspace }: WorkspaceIssueTabProps) {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadSignals() {
      setLoadState("loading");

      try {
        const nextNotifications = await getNotificationsForRecipient(workspace.accountId, 50);
        if (cancelled) {
          return;
        }

        setNotifications(nextNotifications);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceIssueTab] Failed to load issue signals:", error);
        }

        if (!cancelled) {
          setNotifications([]);
          setLoadState("error");
        }
      }
    }

    void loadSignals();

    return () => {
      cancelled = true;
    };
  }, [workspace.accountId]);

  const issues = useMemo(
    () =>
      getWorkspaceIssueSignals(
        workspace,
        notifications.map((notification) => ({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          timestamp: notification.timestamp,
          sourceEventType: notification.sourceEventType,
          metadata: notification.metadata,
        })),
      ),
    [notifications, workspace],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Issues</CardTitle>
        <CardDescription>
          將目前工作區的設定缺口與 warning / alert 訊號整理成 issue register。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading issue signals…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法同步通知訊號，以下先顯示工作區設定所推導出的 issues。
          </p>
        )}

        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                    <Badge variant={severityVariantMap[issue.severity]}>{issue.severity}</Badge>
                    <Badge variant="outline">{issue.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.detail}</p>
                </div>
                <p className="text-xs text-muted-foreground">Source: {issue.source}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
