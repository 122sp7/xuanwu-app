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
import type { IssueEntity } from "../../domain/entities/Issue";
import {
  canTransitionIssue,
  ISSUE_LIFECYCLE_STATUSES,
  type IssueLifecycleStatus,
  type IssueStage,
} from "../../domain/value-objects/issue-state";
import { createIssue, deleteIssue, transitionIssueStatus } from "../_actions/issue.actions";
import { getIssues } from "../queries/issue.queries";

interface WorkspaceIssueTabProps {
  readonly workspace: WorkspaceEntity;
}

const STATUS_VARIANT: Record<IssueLifecycleStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "destructive",
  investigating: "default",
  fixing: "default",
  retest: "outline",
  resolved: "secondary",
  closed: "secondary",
};

const STAGE_LABEL: Record<IssueStage, string> = {
  task: "Task",
  qa: "QA",
  acceptance: "Acceptance",
  finance: "Finance",
};

/** Returns valid next statuses the user can transition to from `current`. */
function nextStatuses(current: IssueLifecycleStatus): IssueLifecycleStatus[] {
  return ISSUE_LIFECYCLE_STATUSES.filter((s) => canTransitionIssue(current, s));
}

export function WorkspaceIssueTab({ workspace }: WorkspaceIssueTabProps) {
  const [issues, setIssues] = useState<IssueEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [stage, setStage] = useState<IssueStage>("task");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    setLoadState("loading");
    try {
      setIssues(await getIssues(workspace.id));
      setLoadState("loaded");
    } catch {
      setIssues([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await loadIssues(); })();
    return () => { cancelled = true; };
  }, [loadIssues]);

  async function handleCreate() {
    const t = title.trim();
    if (!t) { setActionError("請輸入 issue 標題。"); return; }
    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createIssue({
        tenantId: workspace.id,
        teamId: workspace.id,
        workspaceId: workspace.id,
        stage,
        relatedId: relatedId.trim() || workspace.id,
        title: t,
        description: description.trim() || undefined,
        createdBy: "ui",
      });
      if (!result.success) { setActionError(result.error.message); return; }
      setTitle("");
      setDescription("");
      setRelatedId("");
      await loadIssues();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleTransition(issueId: string, to: IssueLifecycleStatus) {
    setPendingId(issueId);
    setActionError(null);
    try {
      const result = await transitionIssueStatus(issueId, to);
      if (!result.success) { setActionError(result.error.message); return; }
      await loadIssues();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(issueId: string) {
    setPendingId(issueId);
    setActionError(null);
    try {
      const result = await deleteIssue(issueId);
      if (!result.success) { setActionError(result.error.message); return; }
      await loadIssues();
    } finally {
      setPendingId(null);
    }
  }

  const openCount = issues.filter((i) => i.status === "open").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved" || i.status === "closed").length;

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Issues</CardTitle>
        <CardDescription>
          跨域 issue 追蹤：open → investigating → fixing → retest → resolved → closed。異常不回退原始狀態機。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="mt-1 text-xl font-semibold">{openCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Resolved / Closed</p>
            <p className="mt-1 text-xl font-semibold">{resolvedCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-semibold">{issues.length}</p>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-border/40 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input value={title} placeholder="Issue 標題" onChange={(e) => setTitle(e.target.value)} disabled={isCreating} />
            <Input value={description} placeholder="描述（選填）" onChange={(e) => setDescription(e.target.value)} disabled={isCreating} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input value={relatedId} placeholder="Related ID（選填）" onChange={(e) => setRelatedId(e.target.value)} disabled={isCreating} />
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as IssueStage)}
              disabled={isCreating}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="task">task</option>
              <option value="qa">qa</option>
              <option value="acceptance">acceptance</option>
              <option value="finance">finance</option>
            </select>
            <Button type="button" onClick={() => void handleCreate()} disabled={isCreating} className="w-full sm:w-auto">
              {isCreating ? "建立中…" : "新增 issue"}
            </Button>
          </div>
        </div>

        {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading issues…</p>}
        {loadState === "error" && <p className="text-sm text-destructive">無法載入 issues，請重新整理。</p>}
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        {loadState === "loaded" && issues.length === 0 && (
          <p className="text-sm text-muted-foreground">尚未建立 issue。</p>
        )}

        <div className="space-y-3">
          {issues.map((issue) => {
            const nexts = nextStatuses(issue.status);
            return (
              <div key={issue.id} className="rounded-xl border border-border/40 px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{issue.title}</p>
                      <Badge variant={STATUS_VARIANT[issue.status]}>{issue.status}</Badge>
                      <Badge variant="outline">{STAGE_LABEL[issue.stage]}</Badge>
                    </div>
                    {issue.description && (
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">relatedId: {issue.relatedId}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {nexts.map((next) => (
                    <Button
                      key={next}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleTransition(issue.id, next)}
                      disabled={pendingId === issue.id}
                    >
                      → {next}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => void handleDelete(issue.id)}
                    disabled={pendingId === issue.id}
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
