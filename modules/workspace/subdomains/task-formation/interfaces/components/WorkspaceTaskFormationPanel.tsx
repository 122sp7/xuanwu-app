"use client";

import { useEffect, useState } from "react";

import { Loader2, Play } from "lucide-react";

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

import type { TaskFormationJob, TaskFormationJobStatus } from "../../application/dto";
import { listTaskFormationJobs } from "../queries/task-formation.queries";
import { tfSubmitFormationJob } from "../_actions/task-formation.actions";

// ── Status display ─────────────────────────────────────────────────────────────

const JOB_STATUS_VARIANT: Record<
  TaskFormationJobStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  queued: "outline",
  running: "secondary",
  partially_succeeded: "secondary",
  succeeded: "default",
  failed: "destructive",
  cancelled: "outline",
};

const JOB_STATUS_LABEL: Record<TaskFormationJobStatus, string> = {
  queued: "排隊中",
  running: "執行中",
  partially_succeeded: "部分成功",
  succeeded: "已完成",
  failed: "失敗",
  cancelled: "已取消",
};

function formatShortDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ── Job Row ────────────────────────────────────────────────────────────────────

function JobRow({ job }: { job: TaskFormationJob }) {
  const progressPct =
    job.totalItems > 0
      ? Math.round((job.processedItems / job.totalItems) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-border/40 px-4 py-3 space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5 min-w-0">
          <p className="text-xs text-muted-foreground font-mono truncate">{job.id}</p>
          <p className="text-xs text-muted-foreground">
            共 {job.totalItems} 頁 · {job.succeededItems} 成功 · {job.failedItems} 失敗
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={JOB_STATUS_VARIANT[job.status]}>
            {JOB_STATUS_LABEL[job.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatShortDate(job.updatedAtISO)}
          </span>
        </div>
      </div>
      {(job.status === "running" || job.status === "queued") && (
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
      {job.errorMessage && (
        <p className="text-xs text-destructive">{job.errorMessage}</p>
      )}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────────────

interface WorkspaceTaskFormationPanelProps {
  readonly workspaceId: string;
  /** Actor that triggers new formation jobs. */
  readonly actorId?: string;
  /**
   * Knowledge page IDs to include when user clicks "Start Formation".
   * When empty the button is disabled.
   */
  readonly knowledgePageIds?: ReadonlyArray<string>;
}

/**
 * Standalone task formation panel.
 * Shows past formation job history and exposes a trigger to start a new job.
 * This panel is independently consumable — it does not depend on WorkspaceFlowTab.
 */
export function WorkspaceTaskFormationPanel({
  workspaceId,
  actorId = "anonymous",
  knowledgePageIds = [],
}: WorkspaceTaskFormationPanelProps) {
  const [jobs, setJobs] = useState<TaskFormationJob[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listTaskFormationJobs(workspaceId)
      .then((data) => {
        if (!cancelled) {
          setJobs(data);
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

  async function handleStartFormation() {
    if (knowledgePageIds.length === 0 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result: CommandResult = await tfSubmitFormationJob({
        workspaceId,
        actorId,
        knowledgePageIds,
      });
      if (result.success) {
        setReloadKey((k) => k + 1);
      } else {
        setSubmitError(result.error.message ?? "提交失敗");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "提交失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>任務形成</CardTitle>
            <CardDescription>
              從知識頁面批次提取並生成任務候選項目。
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="default"
            disabled={knowledgePageIds.length === 0 || submitting}
            onClick={() => void handleStartFormation()}
          >
            {submitting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-3.5 w-3.5" />
            )}
            開始形成
          </Button>
        </div>
        {submitError && (
          <p className="mt-1 text-xs text-destructive">{submitError}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">載入中…</p>
        )}
        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入任務形成記錄，請重新整理頁面。</p>
        )}
        {loadState === "loaded" && jobs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            尚無任務形成記錄。選取知識頁面後點擊「開始形成」。
          </p>
        )}
        {loadState === "loaded" &&
          jobs.map((job) => <JobRow key={job.id} job={job} />)}
      </CardContent>
    </Card>
  );
}
