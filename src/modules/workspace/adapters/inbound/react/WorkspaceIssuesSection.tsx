"use client";

/**
 * WorkspaceIssuesSection — workspace.issues tab — issue tracker.
 */

import { AlertCircle, Plus, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { listIssuesByTaskAction } from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import type { IssueSnapshot } from "@/src/modules/workspace/subdomains/issue/domain/entities/Issue";
import type { IssueStatus } from "@/src/modules/workspace/subdomains/issue/domain/value-objects/IssueStatus";

interface WorkspaceIssuesSectionProps {
  workspaceId: string;
  accountId: string;
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

const STATUS_VARIANT: Record<IssueStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "destructive",
  investigating: "secondary",
  fixing: "secondary",
  retest: "secondary",
  resolved: "default",
  closed: "outline",
};

export function WorkspaceIssuesSection({
  workspaceId,
  accountId: _accountId,
}: WorkspaceIssuesSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<IssueFilter>("全部");
  const [issues, setIssues] = useState<IssueSnapshot[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadIssues = useCallback(
    (targetWorkspaceId: string) =>
      listTasksByWorkspaceAction(targetWorkspaceId)
        .then(async (tasks) => {
          const issueArrays = await Promise.all(
            tasks.map((t) => listIssuesByTaskAction(t.id)),
          );
          return issueArrays.flat();
        })
        .then(setIssues)
        .catch(() => setIssues([]))
        .finally(() => setLoadedWorkspaceId(targetWorkspaceId)),
    [],
  );

  useEffect(() => {
    loadIssues(workspaceId);
  }, [loadIssues, workspaceId]);

  const filteredIssues = issues.filter((i) =>
    STATUS_FILTER_MAP[filter].includes(i.status),
  );

  const handleRefresh = () => {
    startTransition(() => {
      loadIssues(workspaceId);
    });
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
        <Button size="sm" variant="outline" onClick={handleRefresh}>
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
        <span>嚴重度：</span>
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
            建立問題單以追蹤工作區中發現的問題、缺陷或待改善事項。
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 rounded-xl border border-border/40">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{issue.title}</p>
                {issue.description && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {issue.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground/70">
                  階段：{issue.stage}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[issue.status]} className="shrink-0 text-xs">
                {STATUS_LABEL[issue.status]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
