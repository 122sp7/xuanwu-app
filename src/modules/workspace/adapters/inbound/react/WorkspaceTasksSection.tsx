"use client";

/**
 * WorkspaceTasksSection — workspace.tasks tab — task list with status filters.
 */

import { CheckSquare, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceTasksSectionProps {
  workspaceId: string;
  accountId: string;
}

type TaskFilter = "全部" | "待執行" | "進行中" | "已完成" | "已取消";
const TASK_FILTERS: TaskFilter[] = ["全部", "待執行", "進行中", "已完成", "已取消"];

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  高: "destructive",
  中: "secondary",
  低: "outline",
};

export function WorkspaceTasksSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceTasksSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<TaskFilter>("全部");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">任務</h2>
        </div>
        <Button size="sm" variant="outline" disabled>
          <Plus className="size-3.5" />
          新增任務
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {TASK_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter === f
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Priority legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>優先級：</span>
        {Object.entries(PRIORITY_VARIANT).map(([label, variant]) => (
          <Badge key={label} variant={variant} className="text-xs">
            {label}
          </Badge>
        ))}
      </div>

      {/* Task list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <CheckSquare className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          {filter === "全部" ? "尚無任務" : `無「${filter}」狀態的任務`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          點擊「新增任務」建立第一個任務，或透過任務形成分頁拆解需求。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          <Plus className="size-3.5" />
          新增任務
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
