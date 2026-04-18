"use client";

/**
 * WorkspaceTasksSection — workspace.tasks tab — task list with status filters.
 */

import { CheckSquare, Plus, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import type { TaskStatus } from "@/src/modules/workspace/subdomains/task/domain/value-objects/TaskStatus";

interface WorkspaceTasksSectionProps {
  workspaceId: string;
  accountId: string;
}

type TaskFilter = "全部" | "待執行" | "進行中" | "已完成" | "已取消";
const TASK_FILTERS: TaskFilter[] = ["全部", "待執行", "進行中", "已完成", "已取消"];

const STATUS_FILTER_MAP: Record<TaskFilter, TaskStatus[]> = {
  全部: ["draft", "in_progress", "qa", "acceptance", "accepted", "archived", "cancelled"],
  待執行: ["draft"],
  進行中: ["in_progress", "qa", "acceptance"],
  已完成: ["accepted", "archived"],
  已取消: ["cancelled"],
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "待執行",
  in_progress: "進行中",
  qa: "質檢中",
  acceptance: "驗收中",
  accepted: "已完成",
  archived: "已歸檔",
  cancelled: "已取消",
};

const STATUS_VARIANT: Record<TaskStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  in_progress: "secondary",
  qa: "secondary",
  acceptance: "secondary",
  accepted: "default",
  archived: "outline",
  cancelled: "destructive",
};

export function WorkspaceTasksSection({
  workspaceId,
  accountId: _accountId,
}: WorkspaceTasksSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<TaskFilter>("全部");
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setIsLoading(true);
    listTasksByWorkspaceAction(workspaceId)
      .then(setTasks)
      .finally(() => setIsLoading(false));
  }, [workspaceId]);

  const filteredTasks = tasks.filter((t) =>
    STATUS_FILTER_MAP[filter].includes(t.status),
  );

  const handleRefresh = () => {
    startTransition(() => {
      listTasksByWorkspaceAction(workspaceId).then(setTasks);
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">任務</h2>
          {tasks.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {tasks.length}
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
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
            {f !== "全部" && (
              <span className="ml-1 opacity-60">
                {tasks.filter((t) => STATUS_FILTER_MAP[f].includes(t.status)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <CheckSquare className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {filter === "全部" ? "尚無任務" : `無「${filter}」狀態的任務`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            點擊「新增任務」建立第一個任務，或透過任務形成分頁拆解需求。
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 rounded-xl border border-border/40">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{task.title}</p>
                {task.description && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}
                {task.dueDateISO && (
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    截止：{new Date(task.dueDateISO).toLocaleDateString("zh-TW")}
                  </p>
                )}
              </div>
              <Badge variant={STATUS_VARIANT[task.status]} className="shrink-0 text-xs">
                {STATUS_LABEL[task.status]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}

