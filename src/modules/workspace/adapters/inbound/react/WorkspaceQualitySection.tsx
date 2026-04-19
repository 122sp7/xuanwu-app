"use client";

/**
 * WorkspaceQualitySection — workspace.quality tab — quality review queue.
 */

import { Badge, Button } from "@packages";
import { ShieldCheck, ClipboardCheck, ClipboardX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  listQualityReviewsAction,
  passQualityReviewAction,
  failQualityReviewAction,
  startQualityReviewAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { openIssueAction } from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import type { QualityReviewSnapshot } from "@/src/modules/workspace/subdomains/quality/domain/entities/QualityReview";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";

interface WorkspaceQualitySectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

export function WorkspaceQualitySection({
  workspaceId,
  accountId: _accountId,
  currentUserId,
}: WorkspaceQualitySectionProps): React.ReactElement {
  const [reviews, setReviews] = useState<QualityReviewSnapshot[]>([]);
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [pendingReviewId, setPendingReviewId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadData = useCallback(
    async (targetWorkspaceId: string) => {
      try {
        const [nextReviews, nextTasks] = await Promise.all([
          listQualityReviewsAction(targetWorkspaceId),
          listTasksByWorkspaceAction(targetWorkspaceId),
        ]);
        setReviews(nextReviews);
        setTasks(nextTasks);
      } catch {
        setReviews([]);
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

  const inReview = useMemo(
    () => reviews.filter((review) => review.status === "in_review"),
    [reviews],
  );
  const passed = useMemo(
    () => reviews.filter((review) => review.status === "passed"),
    [reviews],
  );
  const failed = useMemo(
    () => reviews.filter((review) => review.status === "failed"),
    [reviews],
  );

  const taskMap = useMemo(
    () => new Map(tasks.map((task) => [task.id, task])),
    [tasks],
  );

  const queueFromTask = useMemo(() => {
    const reviewTaskIds = new Set(inReview.map((review) => review.taskId));
    return tasks.filter(
      (task) => task.status === "qa" && !reviewTaskIds.has(task.id),
    );
  }, [inReview, tasks]);

  const handleStartReview = (task: TaskSnapshot) => {
    if (!currentUserId) return;
    setPendingReviewId(task.id);
    startTransition(async () => {
      try {
        await startQualityReviewAction({
          taskId: task.id,
          workspaceId,
          reviewerId: currentUserId,
        });
      } finally {
        setPendingReviewId(null);
        loadData(workspaceId);
      }
    });
  };

  const handlePass = (review: QualityReviewSnapshot) => {
    setPendingReviewId(review.id);
    startTransition(async () => {
      try {
        await passQualityReviewAction(review.id);
      } finally {
        setPendingReviewId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleFail = (review: QualityReviewSnapshot) => {
    setPendingReviewId(review.id);
    startTransition(async () => {
      try {
        await failQualityReviewAction(review.id);
        if (currentUserId) {
          const task = taskMap.get(review.taskId);
          await openIssueAction({
            workspaceId,
            taskId: review.taskId,
            stage: "qa",
            title: `質檢未通過：${task?.title ?? review.taskId}`,
            description: "質檢未通過，已自動建立問題單供修復追蹤。",
            createdBy: currentUserId,
          });
        }
      } finally {
        setPendingReviewId(null);
        loadData(workspaceId);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">質檢</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          待審核 {inReview.length + queueFromTask.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "待質檢", count: inReview.length + queueFromTask.length, icon: <ShieldCheck className="size-3.5 text-amber-500" /> },
          { label: "通過", count: passed.length, icon: <ClipboardCheck className="size-3.5 text-emerald-500" /> },
          { label: "未通過", count: failed.length, icon: <ClipboardX className="size-3.5 text-destructive" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.count}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {queueFromTask.map((task) => (
            <div key={task.id} className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">任務已進入 QA 階段，尚未建立質檢單。</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 h-7 px-2 text-xs"
                disabled={!currentUserId || pendingReviewId === task.id}
                onClick={() => handleStartReview(task)}
              >
                {pendingReviewId === task.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="size-3.5" />
                )}
                建立質檢單
              </Button>
            </div>
          ))}

          {inReview.map((review) => {
            const task = taskMap.get(review.taskId);
            return (
              <div key={review.id} className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{task?.title ?? review.taskId}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      進行中 · Reviewer: {review.reviewerId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={pendingReviewId === review.id}
                      onClick={() => handleFail(review)}
                    >
                      {pendingReviewId === review.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ClipboardX className="size-3.5" />
                      )}
                      未通過
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={pendingReviewId === review.id}
                      onClick={() => handlePass(review)}
                    >
                      {pendingReviewId === review.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ClipboardCheck className="size-3.5" />
                      )}
                      通過
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {queueFromTask.length === 0 && inReview.length === 0 && (
            <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
              <ShieldCheck className="mx-auto mb-3 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">目前沒有待質檢項目</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                任務從「任務」送交後會在此進入質檢。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
