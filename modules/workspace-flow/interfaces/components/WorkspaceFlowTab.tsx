"use client";

/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks, Issues, and Invoices managed by workspace-flow.
 *
 * MVP interactive surface:
 * - Create Task dialog
 * - Task lifecycle transition buttons (assign → QA → acceptance → archive)
 * - Per-task expandable Issue sub-list with transition buttons
 * - Open Issue dialog
 * - Create Invoice button + Invoice lifecycle transitions
 *
 * @author workspace-flow
 * @created 2026-03-27
 */

import { useCallback, useEffect, useState } from "react";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";
import { Textarea } from "@ui-shadcn/ui/textarea";

import type { Invoice } from "../../domain/entities/Invoice";
import type { Issue } from "../../domain/entities/Issue";
import type { Task } from "../../domain/entities/Task";
import type { IssueStage } from "../../domain/value-objects/IssueStage";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import {
  wfApproveInvoice,
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfAssignTask,
  wfCloseInvoice,
  wfCloseIssue,
  wfCreateInvoice,
  wfCreateTask,
  wfFailIssueRetest,
  wfFixIssue,
  wfOpenIssue,
  wfPassIssueRetest,
  wfPassTaskQa,
  wfPayInvoice,
  wfRejectInvoice,
  wfReviewInvoice,
  wfStartIssue,
  wfSubmitInvoice,
  wfSubmitIssueRetest,
  wfSubmitTaskToQa,
} from "../_actions/workspace-flow.actions";
import {
  getWorkspaceFlowInvoices,
  getWorkspaceFlowIssues,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";

// ── Status display maps ────────────────────────────────────────────────────────

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

const ISSUE_STATUS_VARIANT: Record<
  Issue["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "destructive",
  investigating: "destructive",
  fixing: "secondary",
  retest: "secondary",
  resolved: "default",
  closed: "outline",
};

const ISSUE_STATUS_LABEL: Record<Issue["status"], string> = {
  open: "開啟",
  investigating: "調查中",
  fixing: "修復中",
  retest: "重測中",
  resolved: "已解決",
  closed: "已關閉",
};

const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  submitted: "secondary",
  finance_review: "secondary",
  approved: "default",
  paid: "default",
  closed: "outline",
};

const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  finance_review: "財務審核",
  approved: "已核准",
  paid: "已付款",
  closed: "已結清",
};

const ISSUE_STAGE_LABEL: Record<IssueStage, string> = {
  task: "任務",
  qa: "QA",
  acceptance: "驗收",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

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

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `TWD ${amount}`;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
}

// ── Create Task Dialog ─────────────────────────────────────────────────────────

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}

function CreateTaskDialog({ open, onClose, onCreated, workspaceId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDateISO, setDueDateISO] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setDueDateISO("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入任務標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfCreateTask({
        workspaceId,
        title: t,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
        dueDateISO: dueDateISO || undefined,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立任務</DialogTitle>
          <DialogDescription>新增一個工作任務到此工作區。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">標題 *</Label>
            <Input
              id="task-title"
              placeholder="任務名稱"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-description">描述（選填）</Label>
            <Textarea
              id="task-description"
              placeholder="任務詳情或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">指派人 ID（選填）</Label>
              <Input
                id="task-assignee"
                placeholder="用戶 ID"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">截止日期（選填）</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDateISO}
                onChange={(e) => setDueDateISO(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "建立任務"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Assign Task Dialog ─────────────────────────────────────────────────────────

interface AssignTaskDialogProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onDone: () => void;
}

function AssignTaskDialog({ open, taskId, onClose, onDone }: AssignTaskDialogProps) {
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setAssigneeId("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const a = assigneeId.trim();
    if (!a) { setError("請輸入指派人 ID。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfAssignTask(taskId, a);
      if (!result.success) { setError(result.error.message ?? "指派失敗"); return; }
      onDone();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "指派失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>指派任務</DialogTitle>
          <DialogDescription>填入負責人 ID，任務將進入進行中。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="assignee-id">指派人 ID *</Label>
            <Input
              id="assignee-id"
              placeholder="用戶 ID"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "指派中…" : "指派"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Open Issue Dialog ──────────────────────────────────────────────────────────

interface OpenIssueDialogProps {
  open: boolean;
  taskId: string;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}

function OpenIssueDialog({ open, taskId, currentUserId, onClose, onCreated }: OpenIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<IssueStage>("task");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setStage("task");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入議題標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfOpenIssue({
        taskId,
        stage,
        title: t,
        description: description.trim() || undefined,
        createdBy: currentUserId,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>開啟議題</DialogTitle>
          <DialogDescription>記錄此任務發現的問題或異常。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">標題 *</Label>
            <Input
              id="issue-title"
              placeholder="問題簡述"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-description">描述（選填）</Label>
            <Textarea
              id="issue-description"
              placeholder="問題詳情、重現步驟…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label>發生階段</Label>
            <div className="flex gap-2">
              {(["task", "qa", "acceptance"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={stage === s ? "default" : "outline"}
                  onClick={() => setStage(s)}
                  disabled={submitting}
                >
                  {ISSUE_STAGE_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "開啟議題"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Issue Row ──────────────────────────────────────────────────────────────────

interface IssueRowProps {
  issue: Issue;
  onTransitioned: () => void;
}

function IssueRow({ issue, onTransitioned }: IssueRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function renderActions() {
    switch (issue.status) {
      case "open":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfStartIssue(issue.id))}>開始調查</Button>;
      case "investigating":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFixIssue(issue.id))}>開始修復</Button>;
      case "fixing":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitIssueRetest(issue.id))}>送重測</Button>;
      case "retest":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassIssueRetest(issue.id))}>通過</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFailIssueRetest(issue.id))}>失敗</Button>
          </div>
        );
      case "resolved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseIssue(issue.id))}>關閉</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg border border-border/30 px-3 py-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={ISSUE_STATUS_VARIANT[issue.status]} className="text-xs">
              {ISSUE_STATUS_LABEL[issue.status]}
            </Badge>
            <Badge variant="outline" className="text-xs">{ISSUE_STAGE_LABEL[issue.stage]}</Badge>
            <span className="font-medium text-foreground truncate">{issue.title}</span>
          </div>
          {issue.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="shrink-0">{renderActions()}</div>
      </div>
    </div>
  );
}

// ── Task Row ───────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  currentUserId: string;
  onTransitioned: () => void;
}

function TaskRow({ task, currentUserId, onTransitioned }: TaskRowProps) {
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

// ── Invoice Row ────────────────────────────────────────────────────────────────

interface InvoiceRowProps {
  invoice: Invoice;
  onTransitioned: () => void;
}

function InvoiceRow({ invoice, onTransitioned }: InvoiceRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function renderActions() {
    switch (invoice.status) {
      case "draft":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitInvoice(invoice.id))}>提交</Button>;
      case "submitted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfReviewInvoice(invoice.id))}>送審</Button>;
      case "finance_review":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveInvoice(invoice.id))}>核准</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfRejectInvoice(invoice.id))}>退回</Button>
          </div>
        );
      case "approved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPayInvoice(invoice.id))}>付款</Button>;
      case "paid":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseInvoice(invoice.id))}>結清</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            #{invoice.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">建立：{formatShortDate(invoice.createdAtISO)}</p>
          {invoice.paidAtISO && (
            <p className="text-xs text-muted-foreground">付款：{formatShortDate(invoice.paidAtISO)}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.totalAmount)}</p>
          {renderActions()}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({ workspaceId, currentUserId = "anonymous" }: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadState("loading");
    try {
      const [nextTasks, nextInvoices] = await Promise.all([
        getWorkspaceFlowTasks(workspaceId),
        getWorkspaceFlowInvoices(workspaceId),
      ]);
      setTasks(nextTasks);
      setInvoices(nextInvoices);
      setLoadState("loaded");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFlowTab] Failed to load flow data:", err);
      }
      setLoadState("error");
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreateInvoice() {
    setCreatingInvoice(true);
    setActionError(null);
    try {
      const result = await wfCreateInvoice(workspaceId);
      if (!result.success) { setActionError(result.error.message ?? "建立發票失敗"); }
      else { await loadData(); }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "建立發票失敗");
    } finally {
      setCreatingInvoice(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Section switcher ─────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          variant={section === "tasks" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("tasks")}
        >
          任務{loadState === "loaded" ? ` (${tasks.length})` : ""}
        </Button>
        <Button
          variant={section === "invoices" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("invoices")}
        >
          發票{loadState === "loaded" ? ` (${invoices.length})` : ""}
        </Button>
      </div>

      {/* ── Loading state ─────────────────────────────────────────────── */}
      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">載入中…</CardContent>
        </Card>
      )}

      {/* ── Error state ───────────────────────────────────────────────── */}
      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入資料，請重新整理頁面後再試。
          </CardContent>
        </Card>
      )}

      {/* ── Tasks section ─────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "tasks" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>任務</CardTitle>
                <CardDescription>工作區所有任務與其進度狀態。</CardDescription>
              </div>
              <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                建立任務
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無任務，點擊右上角「建立任務」開始。</p>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Invoices section ──────────────────────────────────────────── */}
      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>發票</CardTitle>
                <CardDescription>工作區帳務請款紀錄。</CardDescription>
              </div>
              <Button size="sm" disabled={creatingInvoice} onClick={handleCreateInvoice}>
                <Plus className="mr-1.5 h-4 w-4" />
                {creatingInvoice ? "建立中…" : "建立發票"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionError && (
              <p role="alert" className="text-sm text-destructive">{actionError}</p>
            )}
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無發票紀錄，點擊右上角「建立發票」開始。</p>
            ) : (
              <>
                <Separator />
                {invoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    onTransitioned={loadData}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Create Task Dialog ─────────────────────────────────────────── */}
      <CreateTaskDialog
        open={createTaskOpen}
        workspaceId={workspaceId}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
}
