"use client";

/**
 * WorkspaceScheduleSection — workspace.schedule tab — project timeline / milestones.
 */

import { CalendarRange, Plus } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceScheduleSectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceScheduleSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceScheduleSectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">排程</h2>
        </div>
        <Button size="sm" variant="outline" disabled>
          <Plus className="size-3.5" />
          新增里程碑
        </Button>
      </div>

      {/* Phase labels */}
      <div className="flex flex-wrap gap-2">
        {["本週", "本月", "季度", "全部"].map((period, i) => (
          <Badge key={period} variant={i === 0 ? "default" : "outline"} className="cursor-pointer text-xs">
            {period}
          </Badge>
        ))}
      </div>

      {/* Timeline — empty state */}
      <div className="relative space-y-0 overflow-hidden rounded-xl border border-border/40 bg-card/30">
        {/* fake timeline rail */}
        <div className="absolute left-6 top-0 h-full w-px bg-border/30" />
        <div className="px-4 py-8 text-center">
          <CalendarRange className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無排程里程碑</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            建立里程碑後，時間軸將顯示專案進度與截止日期。
          </p>
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}
