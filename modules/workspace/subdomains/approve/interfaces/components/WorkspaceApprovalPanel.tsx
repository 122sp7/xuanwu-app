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

interface WorkspaceApprovalPanelProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Standalone approval section panel.
 * Displays all tasks in "acceptance" or "accepted" status for the given workspace
 * and allows the Approve Acceptance transition.
 * This panel is independently consumable — it does not depend on WorkspaceFlowTab.
 */
export function WorkspaceApprovalPanel({
  workspaceId,
  currentUserId = "anonymous",
}: WorkspaceApprovalPanelProps) {
  const [acceptanceTasks, setAcceptanceTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getWorkspaceFlowTasks(workspaceId)
      .then((all) => {
        if (!cancelled) {
          setAcceptanceTasks(
            all.filter((t) => t.status === "acceptance" || t.status === "accepted"),
          );
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
        <CardTitle>驗收</CardTitle>
        <CardDescription>進行驗收中與已完成驗收的任務。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">載入中…</p>
        )}
        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入驗收任務，請重新整理頁面。</p>
        )}
        {loadState === "loaded" && acceptanceTasks.length === 0 && (
          <p className="text-sm text-muted-foreground">目前沒有驗收中的任務。</p>
        )}
        {loadState === "loaded" &&
          acceptanceTasks.map((task) => (
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
