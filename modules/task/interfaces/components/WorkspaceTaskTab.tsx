"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Button } from "@/ui/shadcn/ui/button";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import type { WorkspaceTaskEntity, WorkspaceTaskStatus } from "@/modules/task/domain/entities/Task";
import {
  createWorkspaceTask,
  deleteWorkspaceTask,
  updateWorkspaceTask,
} from "../_actions/task.actions";
import { getWorkspaceTasks } from "../queries/task.queries";

interface WorkspaceTaskTabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  pending: "default",
  "in-progress": "outline",
  completed: "secondary",
} as const;

function formatTaskDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function WorkspaceTaskTab({ workspace }: WorkspaceTaskTabProps) {
  const [tasks, setTasks] = useState<WorkspaceTaskEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoadState("loading");

    try {
      const nextTasks = await getWorkspaceTasks(workspace.id);
      setTasks(nextTasks);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceTaskTab] Failed to load tasks:", error);
      }
      setTasks([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) {
        return;
      }
      await loadTasks();
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadTasks]);

  const pendingCount = useMemo(() => tasks.filter((task) => task.status === "pending").length, [tasks]);
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks],
  );

  async function handleCreateTask() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setActionError("請輸入任務標題。");
      return;
    }

    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createWorkspaceTask({
        workspaceId: workspace.id,
        title: normalizedTitle,
        description: description.trim() || undefined,
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }

      setTitle("");
      setDescription("");
      await loadTasks();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleStatusChange(taskId: string, status: WorkspaceTaskStatus) {
    setPendingTaskId(taskId);
    setActionError(null);
    try {
      const result = await updateWorkspaceTask(taskId, { status });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadTasks();
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: string) {
    setPendingTaskId(taskId);
    setActionError(null);
    try {
      const result = await deleteWorkspaceTask(taskId);
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadTasks();
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          以工作區為邊界管理任務，支援建立、狀態更新與刪除。
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
              Workspace task module
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={title}
            placeholder="新增任務標題"
            onChange={(event) => setTitle(event.target.value)}
            disabled={isCreating}
          />
          <Input
            value={description}
            placeholder="描述（選填）"
            onChange={(event) => setDescription(event.target.value)}
            disabled={isCreating}
          />
          <Button
            type="button"
            onClick={() => void handleCreateTask()}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            {isCreating ? "建立中…" : "新增任務"}
          </Button>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading workspace tasks…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入任務資料，請重新整理頁面或稍後再試。
          </p>
        )}

        {actionError && <p className="text-sm text-destructive">{actionError}</p>}

        {loadState === "loaded" && tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未建立任務，可先新增第一筆任務。
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
                    <Badge variant="outline">{task.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.description || "無描述"}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>負責人：{task.assigneeId ?? "未指派"}</p>
                  <p className="mt-1">到期日：{formatTaskDate(task.dueDateISO)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {task.status !== "pending" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(task.id, "pending")}
                    disabled={pendingTaskId === task.id}
                  >
                    標記待處理
                  </Button>
                )}
                {task.status !== "in-progress" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(task.id, "in-progress")}
                    disabled={pendingTaskId === task.id}
                  >
                    進行中
                  </Button>
                )}
                {task.status !== "completed" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(task.id, "completed")}
                    disabled={pendingTaskId === task.id}
                  >
                    完成
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDeleteTask(task.id)}
                  disabled={pendingTaskId === task.id}
                >
                  刪除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
