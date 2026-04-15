"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../application/dto/workflow.dto";
import type { IssueStage } from "../../application/dto/workflow.dto";
import {
  wfCloseIssue,
  wfFixIssue,
  wfStartIssue,
} from "../_actions/workspace-flow-issue.actions";
import {
  wfFailIssueRetest,
  wfPassIssueRetest,
  wfSubmitIssueRetest,
} from "../../../validation/interfaces/_actions/workspace-flow-validation.actions";

export const ISSUE_STAGE_LABEL: Record<IssueStage, string> = {
  task: "任務",
  qa: "QA",
  acceptance: "驗收",
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

export interface IssueRowProps {
  issue: Issue;
  onTransitioned: () => void;
}

export function IssueRow({ issue, onTransitioned }: IssueRowProps) {
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
 
