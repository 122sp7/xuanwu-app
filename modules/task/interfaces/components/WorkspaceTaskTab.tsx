"use client";

import { useCallback, useEffect, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import type { TaskEntity } from "../../domain/entities/Task";
import { nextTaskStatus } from "../../domain/value-objects/task-state";
import { createTask, deleteTask, transitionTaskStatus } from "../_actions/task.actions";
import { getTasks } from "../queries/task.queries";

interface WorkspaceTaskTabProps {
  readonly workspace: WorkspaceEntity;
}

/**
 * Status badge colour — communicates lifecycle stage at a glance.
 * draft=outline, active stages=default, accepted=secondary, archived=destructive.
 */
const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  in_progress: "default",
  qa: "default",
  acceptance: "default",
  accepted: "secondary",
  archived: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  qa: "QA",
  acceptance: "Acceptance",
  accepted: "Accepted ✓",
  archived: "Archived",
};

const ADVANCE_LABEL: Record<string, string> = {
  draft: "Start →",
  in_progress: "Send to QA →",
  qa: "Send to Acceptance →",
  acceptance: "Accept →",
  accepted: "Archive →",
};

export function WorkspaceTaskTab({ workspace }: WorkspaceTaskTabProps) {
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoadState("loading");
    try {
      setTasks(await getTasks(workspace.id));
      setLoadState("loaded");
    } catch {
      setTasks([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadTasks();
    })();
    return () => { cancelled = true; };
  }, [loadTasks]);

  async function handleCreate() {
    const t = title.trim();
    if (!t) { setActionError("請輸入任務標題。"); return; }
    setIsCreating(true);
    setActionError(null);
    try {
      // tenantId / teamId are wired from auth context in production;
      // passing workspaceId as placeholder keeps the scaffold functional.
      const result = await createTask({
        tenantId: workspace.id,
        teamId: workspace.id,
        workspaceId: workspace.id,
        title: t,
        description: description.trim() || undefined,
      });
      if (!result.success) { setActionError(result.error.message); return; }
      setTitle("");
      setDescription("");
      await loadTasks();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleAdvance(task: TaskEntity) {
    const next = nextTaskStatus(task.status);
    if (!next) return;
    setPendingId(task.id);
    setActionError(null);
    try {
      const result = await transitionTaskStatus(task.id, next);
      if (!result.success) { setActionError(result.error.message); return; }
      await loadTasks();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(taskId: string) {
    setPendingId(taskId);
    setActionError(null);
    try {
      const result = await deleteTask(taskId);
      if (!result.success) { setActionError(result.error.message); return; }
      await loadTasks();
    } finally {
      setPendingId(null);
    }
  }

  const acceptedCount = tasks.filter((t) => t.status === "accepted").length;
  const activeCount = tasks.filter((t) => !["archived", "accepted"].includes(t.status)).length;

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          MDDD 任務流程：draft → in_progress → qa → acceptance → accepted → archived。狀態只能前進；異常請開 Issue。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="mt-1 text-xl font-semibold">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Accepted</p>
            <p className="mt-1 text-xl font-semibold">{acceptedCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-semibold">{tasks.length}</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input value={title} placeholder="任務標題" onChange={(e) => setTitle(e.target.value)} disabled={isCreating} />
          <Input value={description} placeholder="描述（選填）" onChange={(e) => setDescription(e.target.value)} disabled={isCreating} />
          <Button type="button" onClick={() => void handleCreate()} disabled={isCreating} className="w-full sm:w-auto">
            {isCreating ? "建立中…" : "新增任務"}
          </Button>
        </div>

        {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading tasks…</p>}
        {loadState === "error" && <p className="text-sm text-destructive">無法載入任務，請重新整理。</p>}
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        {loadState === "loaded" && tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">尚未建立任務。</p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => {
            const next = nextTaskStatus(task.status);
            return (
              <div key={task.id} className="rounded-xl border border-border/40 px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{task.title}</p>
                      <Badge variant={STATUS_VARIANT[task.status] ?? "outline"}>
                        {STATUS_LABEL[task.status] ?? task.status}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                  {task.assigneeId && (
                    <p className="text-xs text-muted-foreground">負責人：{task.assigneeId}</p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {next && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleAdvance(task)}
                      disabled={pendingId === task.id}
                    >
                      {ADVANCE_LABEL[task.status] ?? `→ ${next}`}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => void handleDelete(task.id)}
                    disabled={pendingId === task.id}
                  >
                    刪除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
