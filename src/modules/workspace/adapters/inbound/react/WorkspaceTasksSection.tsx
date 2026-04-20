"use client";

/**
 * WorkspaceTasksSection — workspace.tasks tab — task list with status filters.
 */

import { Badge, Button } from "@packages";
import { CheckSquare, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";

import {
  listTasksByWorkspaceAction,
  transitionTaskStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { startQualityReviewAction } from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import { listApprovalDecisionsAction } from "@/src/modules/workspace/adapters/inbound/server-actions/approval-actions";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import type { TaskStatus } from "@/src/modules/workspace/subdomains/task/domain/value-objects/TaskStatus";

interface WorkspaceTasksSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
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
  accountId,
  currentUserId,
}: WorkspaceTasksSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<TaskFilter>("全部");
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [rejectedTaskIds, setRejectedTaskIds] = useState<ReadonlySet<string>>(new Set());
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadData = useCallback(
    async (targetWorkspaceId: string) => {
      try {
        const [nextTasks, decisions] = await Promise.all([
          listTasksByWorkspaceAction(targetWorkspaceId),
          listApprovalDecisionsAction(targetWorkspaceId),
        ]);
        setTasks(nextTasks);
        // A task is in "rejection-rework" mode when it has at least one rejected
        // decision and no currently-pending decision (pending would mean it is
        // already back in the acceptance review queue).
        const pendingIds = new Set(
          decisions.filter((d) => d.status === "pending").map((d) => d.taskId),
        );
        const rejectedIds = new Set(
          decisions
            .filter((d) => d.status === "rejected" && !pendingIds.has(d.taskId))
            .map((d) => d.taskId),
        );
        setRejectedTaskIds(rejectedIds);
      } catch {
        setTasks([]);
        setRejectedTaskIds(new Set());
      } finally {
        setLoadedWorkspaceId(targetWorkspaceId);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(workspaceId);
  }, [loadData, workspaceId]);

  const filteredTasks = tasks.filter((t) =>
    STATUS_FILTER_MAP[filter].includes(t.status),
  );

  const handleRefresh = () => {
    startTransition(() => {
      loadData(workspaceId);
    });
  };

  const handleAdvance = (task: TaskSnapshot) => {
    if (!currentUserId) return;
    setPendingTaskId(task.id);
    startTransition(async () => {
      try {
        if (task.status === "draft") {
          await transitionTaskStatusAction(task.id, { to: "in_progress" });
        } else if (task.status === "in_progress") {
          if (rejectedTaskIds.has(task.id)) {
            // Post-rejection rework: approval previously rejected this task.
            // Skip re-QA and send directly back to acceptance for re-review.
            await transitionTaskStatusAction(task.id, { to: "acceptance" });
          } else {
            // Normal first-pass or post-QA-failure path: send through QA.
            await startQualityReviewAction({
              taskId: task.id,
              workspaceId,
              reviewerId: currentUserId,
            });
          }
        }
      } finally {
        setPendingTaskId(null);
        loadData(workspaceId);
      }
    });
  };

  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;
  const getActionConfig = (task: TaskSnapshot):
    | { label: string; onClick: () => void; disabled?: boolean }
    | { label: string; href: string }
    | null => {
    if (task.status === "draft") {
      return {
        label: "開始執行",
        onClick: () => handleAdvance(task),
        disabled: !currentUserId || pendingTaskId === task.id,
      };
    }
    if (task.status === "in_progress") {
      // Show "重新送驗" when approval was previously rejected (bypass re-QA);
      // show "送交質檢" for the normal first-pass or post-QA-failure path.
      const isRejectionRework = rejectedTaskIds.has(task.id);
      return {
        label: isRejectionRework ? "重新送驗" : "送交質檢",
        onClick: () => handleAdvance(task),
        disabled: !currentUserId || pendingTaskId === task.id,
      };
    }
    if (task.status === "qa") {
      return { label: "前往質檢", href: `${base}?tab=Quality` };
    }
    if (task.status === "acceptance") {
      return { label: "前往驗收", href: `${base}?tab=Approval` };
    }
    if (task.status === "accepted") {
      return { label: "前往結算", href: `${base}?tab=Settlement` };
    }
    return null;
  };

  return (
    <div className="space-y-5">
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
          <RefreshCw className="size-3.5" />
          重新整理
        </Button>
      </div>

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
            可先至「任務形成」生成候選，再於此推進到質檢與驗收。
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 rounded-xl border border-border/40">
          {filteredTasks.map((task) => {
            const action = getActionConfig(task);
            return (
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
                  {(task.unitPrice !== null || task.contractQuantity !== null) && (
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {task.unitPrice !== null && (
                        <span>單價：{task.unitPrice.toLocaleString("zh-TW")} TWD</span>
                      )}
                      {task.unitPrice !== null && task.contractQuantity !== null && (
                        <span className="mx-1">·</span>
                      )}
                      {task.contractQuantity !== null && (
                        <span>數量：{task.contractQuantity}</span>
                      )}
                      {task.unitPrice !== null && task.contractQuantity !== null && (
                        <span className="ml-1 font-medium text-foreground">
                          （小計 {(task.unitPrice * task.contractQuantity).toLocaleString("zh-TW")} TWD）
                        </span>
                      )}
                    </p>
                  )}
                  {action && (
                    <div className="mt-2">
                      {"href" in action ? (
                        <Link href={action.href}>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            {action.label}
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          disabled={action.disabled}
                          onClick={action.onClick}
                        >
                          {pendingTaskId === task.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <ArrowRight className="size-3.5" />
                          )}
                          {action.label}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <Badge variant={STATUS_VARIANT[task.status]} className="shrink-0 text-xs">
                  {STATUS_LABEL[task.status]}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
