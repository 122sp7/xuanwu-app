"use client";

import { useEffect, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceSchedule } from "../queries/schedule.queries";
import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  upcoming: "default",
  scheduled: "outline",
  completed: "secondary",
} as const;

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const [items, setItems] = useState<readonly WorkspaceScheduleItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      setLoadState("loading");

      try {
        const nextItems = await getWorkspaceSchedule(workspace.id);
        if (cancelled) {
          return;
        }

        setItems(nextItems);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceScheduleTab] Failed to load schedule signals:", error);
        }

        if (!cancelled) {
          setItems([]);
          setLoadState("error");
        }
      }
    }

    void loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [workspace.id]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>
          以工作區生命週期與 finance 節點整理目前可追蹤的 milestone / follow-up 行程。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading schedule signals…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入 schedule 資料，請稍後再試。</p>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge variant={statusVariantMap[item.status]}>{item.status}</Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.timeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
