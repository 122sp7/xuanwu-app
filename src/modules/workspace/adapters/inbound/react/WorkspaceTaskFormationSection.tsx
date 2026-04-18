"use client";

/**
 * WorkspaceTaskFormationSection — workspace.task-formation tab — task pipeline formation.
 */

import { ListPlus, ArrowRight } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceTaskFormationSectionProps {
  workspaceId: string;
  accountId: string;
}

const PIPELINE_STAGES = [
  { label: "需求收集", count: 0, color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { label: "評估分析", count: 0, color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  { label: "任務拆解", count: 0, color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
  { label: "待指派", count: 0, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
] as const;

export function WorkspaceTaskFormationSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceTaskFormationSectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">任務形成</h2>
        </div>
        <Button size="sm" variant="outline" disabled>
          <ListPlus className="size-3.5" />
          新增需求
        </Button>
      </div>

      {/* Pipeline stages */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-stretch">
            <div
              className={`flex items-center justify-between rounded-xl border px-3 py-3 sm:flex-col sm:items-start sm:gap-2 ${stage.color}`}
            >
              <p className="text-xs font-medium">{stage.label}</p>
              <Badge variant="outline" className="text-xs border-inherit">
                {stage.count}
              </Badge>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <ArrowRight className="size-3.5 shrink-0 rotate-90 text-muted-foreground/40 sm:rotate-0 sm:self-center" />
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <ListPlus className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無待處理的需求</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          收集需求、評估後拆解為可執行任務，再指派至執行人員。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}
