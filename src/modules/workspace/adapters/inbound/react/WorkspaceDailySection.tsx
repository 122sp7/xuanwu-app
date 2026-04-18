"use client";

/**
 * WorkspaceDailySection — workspace.daily tab — daily standup / today's task snapshot.
 */

import { CalendarDays, CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceDailySectionProps {
  workspaceId: string;
  accountId: string;
}

const today = new Date();
const dateLabel = today.toLocaleDateString("zh-Hant-TW", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function WorkspaceDailySection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceDailySectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">每日</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          {dateLabel}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "今日任務", value: "0", icon: <Circle className="size-3.5 text-muted-foreground" /> },
          { label: "已完成", value: "0", icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
          { label: "進行中", value: "0", icon: <Clock className="size-3.5 text-amber-500" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's task list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">今日尚無安排的任務</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          從任務分頁建立任務後，今日排程將會顯示在此。
        </p>
        <Button size="sm" variant="outline" className="mt-4">
          前往任務分頁
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
