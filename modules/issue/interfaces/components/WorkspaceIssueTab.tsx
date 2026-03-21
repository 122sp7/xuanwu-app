"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
import type { WorkspaceIssueEntity, WorkspaceIssueStatus } from "../../domain/entities/Issue";
import {
  createWorkspaceIssue,
  deleteWorkspaceIssue,
  updateWorkspaceIssue,
} from "../_actions/issue.actions";
import { getWorkspaceIssues } from "../queries/issue.queries";

interface WorkspaceIssueTabProps {
  readonly workspace: WorkspaceEntity;
}

const severityVariantMap = {
  low: "outline",
  medium: "secondary",
  high: "default",
} as const;

export function WorkspaceIssueTab({ workspace }: WorkspaceIssueTabProps) {
  const [issues, setIssues] = useState<WorkspaceIssueEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingIssueId, setPendingIssueId] = useState<string | null>(null);

  const loadIssues = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoadState("loading");
    }

    try {
      const nextIssues = await getWorkspaceIssues(workspace.id);
      setIssues(nextIssues);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceIssueTab] Failed to load issues:", error);
      }
      setIssues([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) {
        return;
      }
      await loadIssues({ silent: true });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadIssues]);

  const openCount = useMemo(() => issues.filter((issue) => issue.status !== "resolved").length, [issues]);
  const resolvedCount = useMemo(
    () => issues.filter((issue) => issue.status === "resolved").length,
    [issues],
  );

  async function handleCreateIssue() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setActionError("請輸入 issue 標題。");
      return;
    }

    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createWorkspaceIssue({
        workspaceId: workspace.id,
        title: normalizedTitle,
        detail: detail.trim() || undefined,
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }

      setTitle("");
      setDetail("");
      await loadIssues({ silent: true });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleStatusChange(issueId: string, status: WorkspaceIssueStatus) {
    setPendingIssueId(issueId);
    setActionError(null);
    try {
      const result = await updateWorkspaceIssue(issueId, { status });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadIssues({ silent: true });
    } finally {
      setPendingIssueId(null);
    }
  }

  async function handleDeleteIssue(issueId: string) {
    setPendingIssueId(issueId);
    setActionError(null);
    try {
      const result = await deleteWorkspaceIssue(issueId);
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadIssues();
    } finally {
      setPendingIssueId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Issues</CardTitle>
        <CardDescription>
          以工作區為邊界管理 issue register，支援建立、狀態更新與刪除。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Open issues</p>
            <p className="mt-1 text-xl font-semibold">{openCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="mt-1 text-xl font-semibold">{resolvedCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Issue source</p>
            <p className="mt-1 text-sm font-semibold text-foreground">Workspace issue module</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={title}
            placeholder="新增 issue 標題"
            onChange={(event) => setTitle(event.target.value)}
            disabled={isCreating}
          />
          <Input
            value={detail}
            placeholder="描述（選填）"
            onChange={(event) => setDetail(event.target.value)}
            disabled={isCreating}
          />
          <Button
            type="button"
            onClick={() => void handleCreateIssue()}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            {isCreating ? "建立中…" : "新增 issue"}
          </Button>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading issues…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入 issue 資料，請重新整理頁面或稍後再試。
          </p>
        )}

        {actionError && <p className="text-sm text-destructive">{actionError}</p>}

        {loadState === "loaded" && issues.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未建立 issue，可先新增第一筆紀錄。
          </p>
        )}

        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                    <Badge variant={severityVariantMap[issue.severity]}>{issue.severity}</Badge>
                    <Badge variant="outline">{issue.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.detail || "無描述"}</p>
                </div>
                <p className="text-xs text-muted-foreground">Source: {issue.source}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {issue.status !== "open" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(issue.id, "open")}
                    disabled={pendingIssueId === issue.id}
                  >
                    標記 open
                  </Button>
                )}
                {issue.status !== "in-progress" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(issue.id, "in-progress")}
                    disabled={pendingIssueId === issue.id}
                  >
                    標記處理中
                  </Button>
                )}
                {issue.status !== "resolved" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(issue.id, "resolved")}
                    disabled={pendingIssueId === issue.id}
                  >
                    標記已解決
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDeleteIssue(issue.id)}
                  disabled={pendingIssueId === issue.id}
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
