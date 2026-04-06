"use client";

import { useCallback, useState } from "react";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../domain/entities/Issue";
import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import {
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfPassTaskQa,
  wfSubmitTaskToQa,
} from "../_actions/workspace-flow.actions";
import { getWorkspaceFlowIssues } from "../queries/workspace-flow.queries";
import { AssignTaskDialog } from "./AssignTaskDialog";
import { IssueRow } from "./IssueRow";
import { OpenIssueDialog } from "./OpenIssueDialog";

const TASK_STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  in_progress: "secondary",
  qa: "secondary",
  acceptance: "default",
  accepted: "default",
  archived: "outline",
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  in_progress: "進行中",
  qa: "QA 審查",
  acceptance: "驗收中",
  accepted: "已驗收",
  archived: "已歸檔",
};

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export interface TaskRowProps {
  task: Task;
  currentUserId: string;
  onTransitioned: () => void;
}

export function TaskRow({ task, currentUserId, onTransitioned }: TaskRowProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issuesExpanded, setIssuesExpanded] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      const data = await getWorkspaceFlowIssues(task.id);
      setIssues(data);
      setIssuesLoaded(true);
    } catch {
      // non-fatal
    }
  }, [task.id]);

  async function toggleIssues() {
    if (!issuesExpanded && !issuesLoaded) {
      await loadIssues();
    }
    setIssuesExpanded((v) => !v);
  }

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderTaskAction() {
    switch (task.status) {
      case "draft":
        return (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setAssignDialogOpen(true)}>
            指派任務
          </Button>
        );
      case "in_progress":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitTaskToQa(task.id))}>送 QA</Button>;
      case "qa":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassTaskQa(task.id))}>QA 通過</Button>;
      case "acceptance":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveTaskAcceptance(task.id))}>驗收通過</Button>;
      case "accepted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfArchiveTask(task.id))}>歸檔</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4 space-y-3">
      {/* ── Task header ─────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          {task.assigneeId && (
            <p className="text-xs text-muted-foreground">指派：{task.assigneeId}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={TASK_STATUS_VARIANT[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>
          {task.dueDateISO && (
            <p className="text-xs text-muted-foreground">截止：{formatShortDate(task.dueDateISO)}</p>
          )}
        </div>
      </div>

      {/* ── Action row ──────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {renderTaskAction()}
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setIssueDialogOpen(true)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          開議題
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground ml-auto"
          onClick={toggleIssues}
        >
          {issuesExpanded ? (
            <ChevronDown className="mr-1 h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="mr-1 h-3.5 w-3.5" />
          )}
          議題{issuesLoaded ? ` (${issues.length})` : ""}
        </Button>
      </div>

      {/* ── Issues sub-list ─────────────────── */}
      {issuesExpanded && (
        <div className="space-y-2 pl-1">
          {issues.length === 0 ? (
            <p className="text-xs text-muted-foreground">此任務目前無議題。</p>
          ) : (
            issues.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                onTransitioned={loadIssues}
              />
            ))
          )}
        </div>
      )}

      {/* ── Dialogs ─────────────────────────── */}
      <AssignTaskDialog
        open={assignDialogOpen}
        taskId={task.id}
        onClose={() => setAssignDialogOpen(false)}
        onDone={onTransitioned}
      />
      <OpenIssueDialog
        open={issueDialogOpen}
        taskId={task.id}
        currentUserId={currentUserId}
        onClose={() => setIssueDialogOpen(false)}
        onCreated={async () => {
          await loadIssues();
          if (!issuesExpanded) setIssuesExpanded(true);
        }}
      />
    </div>
  );
}
