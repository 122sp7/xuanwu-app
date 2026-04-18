"use client";

/**
 * WorkspaceIssuesSection — workspace.issues tab — issue tracker.
 */

import { AlertCircle, Plus, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceIssuesSectionProps {
  workspaceId: string;
  accountId: string;
}

type IssueFilter = "全部" | "開啟" | "處理中" | "已關閉";
const ISSUE_FILTERS: IssueFilter[] = ["全部", "開啟", "處理中", "已關閉"];

export function WorkspaceIssuesSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceIssuesSectionProps): React.ReactElement {
  const [filter, setFilter] = useState<IssueFilter>("全部");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">問題單</h2>
        </div>
        <Button size="sm" variant="outline" disabled>
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
          </button>
        ))}
      </div>

      {/* Priority legend */}
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

      {/* Issues list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <AlertCircle className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          {filter === "全部" ? "尚無問題單" : `無「${filter}」狀態的問題單`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          建立問題單以追蹤工作區中發現的問題、缺陷或待改善事項。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          <Plus className="size-3.5" />
          建立問題單
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
