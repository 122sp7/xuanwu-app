"use client";

/**
 * WorkspaceIssuesSection — workspace.issues tab — issue tracker with full lifecycle management.
 *
 * Supports:
 * - Listing workspace issues with status filter
 * - Creating issues manually via dialog (task + stage + title + description)
 * - Transitioning issue status via FSM-derived action buttons
 * - Viewing closed issues separately
 */

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@packages";
import { AlertCircle, Plus, AlertTriangle, Info, Loader2, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

import {
  listIssuesByWorkspaceAction,
  openIssueAction,
  transitionIssueStatusAction,
  resolveIssueAction,
  closeIssueAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import {
  listTasksByWorkspaceAction,
  transitionTaskStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { startQualityReviewAction } from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import type { IssueSnapshot } from "@/src/modules/workspace/subdomains/issue/domain/entities/Issue";
import type { IssueStatus } from "@/src/modules/workspace/subdomains/issue/domain/value-objects/IssueStatus";
import type { IssueStage } from "@/src/modules/workspace/subdomains/issue/domain/value-objects/IssueStage";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import {
  getIssueTransitionEvents,
  ISSUE_EVENT_TO_STATUS,
  ISSUE_EVENT_LABEL,
} from "@/src/modules/workspace/subdomains/issue/application/machines/issueLifecycle.machine";

// ── Types & constants ────────────────────────────────────────────────────────

interface WorkspaceIssuesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

type IssueFilter = "全部" | "開啟" | "處理中" | "已關閉";
const ISSUE_FILTERS: IssueFilter[] = ["全部", "開啟", "處理中", "已關閉"];

const STATUS_FILTER_MAP: Record<IssueFilter, IssueStatus[]> = {
  全部: ["open", "investigating", "fixing", "retest", "resolved", "closed"],
  開啟: ["open", "investigating"],
  處理中: ["fixing", "retest"],
  已關閉: ["resolved", "closed"],
};

const STATUS_LABEL: Record<IssueStatus, string> = {
  open: "開啟",
  investigating: "調查中",
  fixing: "修復中",
  retest: "重測",
  resolved: "已解決",
  closed: "已關閉",
};

const STATUS_VARIANT: Record<
  IssueStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "destructive",
  investigating: "secondary",
  fixing: "secondary",
  retest: "secondary",
  resolved: "default",
  closed: "outline",
};

const STAGE_LABEL: Record<IssueStage, string> = {
  task: "任務",
  qa: "質檢",
  acceptance: "驗收",
};

// ── CreateIssueDialog ────────────────────────────────────────────────────────

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  currentUserId: string;
  tasks: TaskSnapshot[];
  onCreated: () => void;
}

function CreateIssueDialog({
  open,
  onOpenChange,
  workspaceId,
  currentUserId,
  tasks,
  onCreated,
}: CreateIssueDialogProps): React.ReactElement {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [stage, setStage] = useState<IssueStage>("task");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    onOpenChange(false);
    setTitle("");
    setDescription("");
    setTaskId(null);
    setStage("task");
    setError(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("請輸入問題標題。");
      return;
    }
    if (!taskId) {
      setError("請選擇關聯任務。");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await openIssueAction({
          workspaceId,
          taskId,
          stage,
          title: title.trim(),
          description: description.trim() || undefined,
          createdBy: currentUserId,
        });
        if (result.success) {
          handleClose();
          onCreated();
        } else {
          setError(result.error?.message ?? "建立失敗，請稍後重試。");
        }
      } catch {
        setError("建立失敗，請稍後重試。");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立問題單</DialogTitle>
          <DialogDescription>
            填寫問題資訊後送出，問題單將進入問題追蹤流程。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Task selection */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-task">關聯任務</Label>
            <Select value={taskId ?? ""} onValueChange={(v) => setTaskId(v || null)}>
              <SelectTrigger id="issue-task" className="w-full">
                <SelectValue placeholder="選擇任務…" />
              </SelectTrigger>
              <SelectContent>
                {tasks.length === 0 ? (
                  <SelectItem value="__none" disabled>
                    （此工作區尚無任務）
                  </SelectItem>
                ) : (
                  tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Stage */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-stage">發現階段</Label>
            <Select
              value={stage}
              onValueChange={(v) => setStage(v as IssueStage)}
            >
              <SelectTrigger id="issue-stage" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">任務</SelectItem>
                <SelectItem value="qa">質檢</SelectItem>
                <SelectItem value="acceptance">驗收</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">問題標題</Label>
            <Input
              id="issue-title"
              placeholder="簡要描述問題…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-desc">
              說明{" "}
              <span className="text-muted-foreground font-normal">(選填)</span>
            </Label>
            <Textarea
              id="issue-desc"
              placeholder="詳細說明問題內容、重現步驟或影響範圍…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isPending}>
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || !taskId}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}
            建立問題單
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── IssueRow ─────────────────────────────────────────────────────────────────

interface IssueRowProps {
  issue: IssueSnapshot;
  taskTitle: string | undefined;
  currentUserId?: string;
  pendingIssueId: string | null;
  onTransition: (issueId: string, targetStatus: IssueStatus) => void;
  onReroute: (issue: IssueSnapshot) => void;
}

function IssueRow({
  issue,
  taskTitle,
  currentUserId,
  pendingIssueId,
  onTransition,
  onReroute,
}: IssueRowProps): React.ReactElement {
  const isPending = pendingIssueId === issue.id;
  const transitions = getIssueTransitionEvents(issue.status);

  // Resolved issues with a qa/acceptance stage get a re-route shortcut
  const rerouteLabel =
    issue.status === "resolved" && issue.stage === "qa"
      ? "送回質檢"
      : issue.status === "resolved" && issue.stage === "acceptance"
        ? "送回驗收"
        : null;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{issue.title}</p>
          <Badge
            variant={STATUS_VARIANT[issue.status]}
            className="shrink-0 text-xs"
          >
            {STATUS_LABEL[issue.status]}
          </Badge>
        </div>
        {issue.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {issue.description}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground/70">
          {taskTitle && <span>任務：{taskTitle}</span>}
          <span>階段：{STAGE_LABEL[issue.stage]}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {/* Lifecycle transition buttons */}
        {currentUserId && transitions.length > 0 && transitions.map((event) => {
          const targetStatus = ISSUE_EVENT_TO_STATUS[event];
          if (!targetStatus) return null;
          return (
            <Button
              key={event}
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              disabled={isPending}
              onClick={() => onTransition(issue.id, targetStatus)}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
              {ISSUE_EVENT_LABEL[event]}
            </Button>
          );
        })}

        {/* Re-route CTA: send resolved issue's task back to QA or acceptance */}
        {currentUserId && rerouteLabel && (
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={isPending}
            onClick={() => onReroute(issue)}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
            {rerouteLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── WorkspaceIssuesSection ───────────────────────────────────────────────────

export function WorkspaceIssuesSection({
  workspaceId,
  accountId: _accountId,
  currentUserId,
}: WorkspaceIssuesSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<IssueFilter>("全部");
  const [issues, setIssues] = useState<IssueSnapshot[]>([]);
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [pendingIssueId, setPendingIssueId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadData = useCallback(
    async (targetWorkspaceId: string) => {
      try {
        const [nextIssues, nextTasks] = await Promise.all([
          listIssuesByWorkspaceAction(targetWorkspaceId),
          listTasksByWorkspaceAction(targetWorkspaceId),
        ]);
        setIssues(nextIssues);
        setTasks(nextTasks);
      } catch {
        setIssues([]);
        setTasks([]);
      } finally {
        setLoadedWorkspaceId(targetWorkspaceId);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(workspaceId);
  }, [loadData, workspaceId]);

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const filteredIssues = issues.filter((i) =>
    STATUS_FILTER_MAP[filter].includes(i.status),
  );

  const handleTransition = (issueId: string, targetStatus: IssueStatus) => {
    setPendingIssueId(issueId);
    startTransition(async () => {
      try {
        if (targetStatus === "resolved") {
          await resolveIssueAction(issueId);
        } else if (targetStatus === "closed") {
          await closeIssueAction(issueId);
        } else {
          await transitionIssueStatusAction(issueId, { to: targetStatus });
        }
      } finally {
        setPendingIssueId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleReroute = (issue: IssueSnapshot) => {
    if (!currentUserId) return;
    setPendingIssueId(issue.id);
    startTransition(async () => {
      try {
        if (issue.stage === "qa") {
          await startQualityReviewAction({
            taskId: issue.taskId,
            workspaceId,
            reviewerId: currentUserId,
          });
        } else if (issue.stage === "acceptance") {
          await transitionTaskStatusAction(issue.taskId, { to: "acceptance" });
        }
      } finally {
        setPendingIssueId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleCreated = () => {
    loadData(workspaceId);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">問題單</h2>
          {issues.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {issues.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          disabled={!currentUserId}
          title={!currentUserId ? "需登入才能建立問題單" : undefined}
        >
          <Plus className="size-3.5" />
          建立問題單
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {ISSUE_FILTERS.map((f) => (
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
                {issues.filter((i) => STATUS_FILTER_MAP[f].includes(i.status)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Severity legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>嚴重度說明：</span>
        <Badge variant="destructive" className="gap-1 text-xs">
          <AlertTriangle className="size-3" /> 高
        </Badge>
        <Badge variant="secondary" className="gap-1 text-xs">
          <AlertCircle className="size-3" /> 中
        </Badge>
        <Badge variant="outline" className="gap-1 text-xs">
          <Info className="size-3" /> 低
        </Badge>
      </div>

      {/* Issues list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <AlertCircle className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {filter === "全部" ? "尚無問題單" : `無「${filter}」狀態的問題單`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {filter === "全部"
              ? "建立問題單以追蹤工作區中發現的問題、缺陷或待改善事項。"
              : "切換篩選條件或等待相關流程產生問題單。"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 rounded-xl border border-border/40">
          {filteredIssues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              taskTitle={taskMap.get(issue.taskId)?.title}
              currentUserId={currentUserId}
              pendingIssueId={pendingIssueId}
              onTransition={handleTransition}
              onReroute={handleReroute}
            />
          ))}
        </div>
      )}

      {/* Create issue dialog */}
      {currentUserId && (
        <CreateIssueDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
          tasks={tasks}
          onCreated={handleCreated}
        />
      )}
    </div>
  ) as React.ReactElement;
}

