"use client";

import { useEffect, useMemo, useState } from "react";

import type { NotificationEntity } from "@/modules/notification";
import type { WorkspaceEntity } from "@/modules/workspace";
import { getNotificationsForRecipient } from "@/modules/notification/interfaces/queries/notification.queries";
import { getWorkspaceOperationalTasks } from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceTaskTabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  pending: "default",
  "in-progress": "outline",
  completed: "secondary",
} as const;

export function WorkspaceTaskTab({ workspace }: WorkspaceTaskTabProps) {
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
          console.warn("[WorkspaceTaskTab] Failed to load task signals:", error);
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

  const tasks = useMemo(
    () =>
      getWorkspaceOperationalTasks(
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

  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status === "pending").length,
    [tasks],
  );
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          以工作區設定、capability 狀態與提醒訊號整理目前的 follow-up tasks。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Open tasks</p>
            <p className="mt-1 text-xl font-semibold">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="mt-1 text-xl font-semibold">{completedCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Task sources</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Config · Capability · Inbox
            </p>
          </div>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading workspace task signals…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法同步提醒訊號，以下先顯示工作區設定所推導出的 tasks。
          </p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{task.title}</p>
                    <Badge variant={statusVariantMap[task.status]}>{task.status}</Badge>
                    <Badge variant="outline">{task.source}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>Owner: {task.owner}</p>
                  <p className="mt-1">Due: {task.dueLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
