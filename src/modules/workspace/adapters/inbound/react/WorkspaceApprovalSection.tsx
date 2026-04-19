"use client";

/**
 * WorkspaceApprovalSection — workspace.approval tab — acceptance review queue.
 */

import { Badge, Button } from "@packages";
import { ClipboardList, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  listApprovalDecisionsAction,
  createApprovalDecisionAction,
  approveTaskAction,
  rejectApprovalAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/approval-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { openIssueAction, listIssuesByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import type { ApprovalDecisionSnapshot } from "@/src/modules/workspace/subdomains/approval/domain/entities/ApprovalDecision";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import type { IssueSnapshot } from "@/src/modules/workspace/subdomains/issue/domain/entities/Issue";

interface WorkspaceApprovalSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

export function WorkspaceApprovalSection({
  workspaceId,
  accountId: _accountId,
  currentUserId,
}: WorkspaceApprovalSectionProps): React.ReactElement {
  const [decisions, setDecisions] = useState<ApprovalDecisionSnapshot[]>([]);
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [issues, setIssues] = useState<IssueSnapshot[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [pendingDecisionId, setPendingDecisionId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadData = useCallback(
    async (targetWorkspaceId: string) => {
      try {
        const [nextDecisions, nextTasks, nextIssues] = await Promise.all([
          listApprovalDecisionsAction(targetWorkspaceId),
          listTasksByWorkspaceAction(targetWorkspaceId),
          listIssuesByWorkspaceAction(targetWorkspaceId),
        ]);
        setDecisions(nextDecisions);
        setTasks(nextTasks);
        setIssues(nextIssues);
      } catch {
        setDecisions([]);
        setTasks([]);
        setIssues([]);
      } finally {
        setLoadedWorkspaceId(targetWorkspaceId);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(workspaceId);
  }, [loadData, workspaceId]);

  const taskMap = useMemo(
    () => new Map(tasks.map((task) => [task.id, task])),
    [tasks],
  );

  // Count open acceptance-stage issues per taskId for block guard UI
  const openAcceptanceIssueCountByTaskId = useMemo(() => {
    const counts = new Map<string, number>();
    for (const issue of issues) {
      if (
        issue.stage === "acceptance" &&
        (issue.status === "open" ||
          issue.status === "investigating" ||
          issue.status === "fixing" ||
          issue.status === "retest")
      ) {
        counts.set(issue.taskId, (counts.get(issue.taskId) ?? 0) + 1);
      }
    }
    return counts;
  }, [issues]);

  const pendingDecisions = useMemo(
    () => decisions.filter((decision) => decision.status === "pending"),
    [decisions],
  );
  const approvedDecisions = useMemo(
    () => decisions.filter((decision) => decision.status === "approved"),
    [decisions],
  );
  const rejectedDecisions = useMemo(
    () => decisions.filter((decision) => decision.status === "rejected"),
    [decisions],
  );

  const acceptanceTasksWithoutDecision = useMemo(() => {
    const pendingTaskIds = new Set(
      pendingDecisions.map((decision) => decision.taskId),
    );
    return tasks.filter(
      (task) => task.status === "acceptance" && !pendingTaskIds.has(task.id),
    );
  }, [pendingDecisions, tasks]);

  const handleCreateDecision = (taskId: string) => {
    if (!currentUserId) return;
    setPendingDecisionId(taskId);
    startTransition(async () => {
      try {
        await createApprovalDecisionAction({
          taskId,
          workspaceId,
          approverId: currentUserId,
        });
      } finally {
        setPendingDecisionId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleApprove = (decision: ApprovalDecisionSnapshot) => {
    setPendingDecisionId(decision.id);
    startTransition(async () => {
      try {
        await approveTaskAction(decision.id);
      } finally {
        setPendingDecisionId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleReject = (decision: ApprovalDecisionSnapshot) => {
    setPendingDecisionId(decision.id);
    startTransition(async () => {
      try {
        await rejectApprovalAction(decision.id);
        if (currentUserId) {
          const task = taskMap.get(decision.taskId);
          await openIssueAction({
            workspaceId,
            taskId: decision.taskId,
            stage: "acceptance",
            title: `驗收退回：${task?.title ?? decision.taskId}`,
            description: "驗收未通過，已建立問題單回流處理。",
            createdBy: currentUserId,
          });
        }
      } finally {
        setPendingDecisionId(null);
        loadData(workspaceId);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">驗收</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          待驗收 {pendingDecisions.length + acceptanceTasksWithoutDecision.length}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "待審核", count: pendingDecisions.length + acceptanceTasksWithoutDecision.length, icon: <Clock className="size-3.5 text-amber-500" /> },
          { label: "已通過", count: approvedDecisions.length, icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
          { label: "已退回", count: rejectedDecisions.length, icon: <XCircle className="size-3.5 text-destructive" /> },
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
          {acceptanceTasksWithoutDecision.map((task) => (
            <div key={task.id} className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">任務待驗收，請先建立驗收單。</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 h-7 px-2 text-xs"
                disabled={!currentUserId || pendingDecisionId === task.id}
                onClick={() => handleCreateDecision(task.id)}
              >
                {pendingDecisionId === task.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ClipboardList className="size-3.5" />
                )}
                建立驗收單
              </Button>
            </div>
          ))}

          {pendingDecisions.map((decision) => {
            const task = taskMap.get(decision.taskId);
            const openIssueCount = openAcceptanceIssueCountByTaskId.get(decision.taskId) ?? 0;
            const hasOpenIssues = openIssueCount > 0;
            return (
              <div key={decision.id} className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{task?.title ?? decision.taskId}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Approver: {decision.approverId}
                    </p>
                    {hasOpenIssues && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-500">
                        <span>⚠</span>
                        <span>{openIssueCount} 個問題單未關閉，請先處理後再通過驗收</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={pendingDecisionId === decision.id}
                      onClick={() => handleReject(decision)}
                    >
                      {pendingDecisionId === decision.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                      退回
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={pendingDecisionId === decision.id || hasOpenIssues}
                      title={hasOpenIssues ? `尚有 ${openIssueCount} 個未關閉問題單` : undefined}
                      onClick={() => handleApprove(decision)}
                    >
                      {pendingDecisionId === decision.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3.5" />
                      )}
                      通過
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {acceptanceTasksWithoutDecision.length === 0 && pendingDecisions.length === 0 && (
            <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
              <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">目前沒有待驗收項目</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                質檢通過後的任務會在此進入驗收流程。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
