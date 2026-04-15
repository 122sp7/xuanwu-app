"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import type { Task } from "../../../task/domain/entities/Task";
import { getWorkspaceFlowTasks } from "../../../task/interfaces/queries/workspace-flow-task.queries";
import { TaskRow } from "../../../task/interfaces/components/TaskRow";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WorkspaceQaPanelProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Standalone QA section panel.
 * Displays all tasks in "qa" status for the given workspace and allows
 * the QA Pass transition.  This panel is independently consumable — it
 * does not depend on WorkspaceFlowTab or any assembly layer.
 */
export function WorkspaceQaPanel({
  workspaceId,
  currentUserId = "anonymous",
}: WorkspaceQaPanelProps) {
  const [qaTasks, setQaTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getWorkspaceFlowTasks(workspaceId)
      .then((all) => {
        if (!cancelled) {
          setQaTasks(all.filter((t) => t.status === "qa"));
          setLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [workspaceId, reloadKey]);

  function handleTransitioned() {
    setLoadState("loading");
    setReloadKey((k) => k + 1);
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <CardTitle>質檢</CardTitle>
        <CardDescription>等待 QA 審查或處於 QA 階段的任務。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">載入中…</p>
        )}
        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入 QA 任務，請重新整理頁面。</p>
        )}
        {loadState === "loaded" && qaTasks.length === 0 && (
          <p className="text-sm text-muted-foreground">目前沒有等待質檢的任務。</p>
        )}
        {loadState === "loaded" &&
          qaTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              onTransitioned={handleTransitioned}
            />
          ))}
      </CardContent>
    </Card>
  );
}
