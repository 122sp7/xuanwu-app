"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers/auth-provider";
import { getWorkspaceSchedule } from "../queries/schedule.queries";
import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import {
  cancelSchedule,
  rejectScheduleAssignment,
  rejectScheduleRequest,
  runScheduleMdddFlow,
} from "../_actions/schedule-mddd.actions";
import { listWorkspaceScheduleMdddFlowProjections } from "../queries/schedule-mddd.queries";
import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/shadcn/ui/alert-dialog";

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

type FlowFilter = "all" | "actionable" | "at-risk" | "completed";
type FlowActionKind = "reject-request" | "reject-assignment" | "cancel-schedule";

interface PendingFlowAction {
  readonly kind: FlowActionKind;
  readonly id: string;
  readonly requestId: string;
}

const statusVariantMap = {
  upcoming: "default",
  scheduled: "outline",
  completed: "secondary",
} as const;
const DEFAULT_CLIENT_LOCALE = "zh-TW";

const DEFAULT_SCHEDULE_RUNTIME_PROFILE = {
  maxLoadPerMember: 4,
  maxConcurrentAssignmentsPerMember: 2,
  requiredSkillId: "schedule.coordination",
  requiredSkillLevel: "junior" as const,
  candidateSkillLevel: "senior" as const,
  requiredHeadcount: 1,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei",
} as const;

function resolveFlowStatusVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!status) {
    return "outline";
  }

  if (["rejected", "cancelled", "conflicted"].includes(status)) {
    return "destructive";
  }

  if (["completed", "closed"].includes(status)) {
    return "secondary";
  }

  if (["accepted", "assigned", "scheduled", "reserved", "active"].includes(status)) {
    return "default";
  }

  return "outline";
}

function resolveClientLocale(): string {
  if (typeof navigator === "undefined") {
    return DEFAULT_CLIENT_LOCALE;
  }

  const firstLanguage = Array.isArray(navigator.languages) ? navigator.languages[0] : undefined;
  return firstLanguage || navigator.language || DEFAULT_CLIENT_LOCALE;
}

function formatUpdatedAt(iso: string): string {
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) {
    return iso;
  }

  return new Intl.DateTimeFormat(resolveClientLocale(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

function isActionableProjection(projection: ScheduleMdddFlowProjection): boolean {
  return (
    ["submitted", "under-review", "accepted"].includes(projection.requestStatus) ||
    projection.assignmentStatus === "proposed" ||
    (projection.scheduleStatus
      ? ["planned", "reserved", "active", "conflicted"].includes(projection.scheduleStatus)
      : false)
  );
}

function isAtRiskProjection(projection: ScheduleMdddFlowProjection): boolean {
  return (
    projection.requestStatus === "rejected" ||
    projection.assignmentStatus === "rejected" ||
    projection.assignmentStatus === "cancelled" ||
    projection.scheduleStatus === "cancelled" ||
    projection.scheduleStatus === "conflicted"
  );
}

function isCompletedProjection(projection: ScheduleMdddFlowProjection): boolean {
  return (
    projection.requestStatus === "closed" ||
    projection.taskStatus === "completed" ||
    projection.scheduleStatus === "completed"
  );
}

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const { state: authState } = useAuth();
  const [items, setItems] = useState<readonly WorkspaceScheduleItem[]>([]);
  const [flowProjections, setFlowProjections] = useState<readonly ScheduleMdddFlowProjection[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [flowLoadState, setFlowLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [runState, setRunState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [flowSearch, setFlowSearch] = useState("");
  const [flowFilter, setFlowFilter] = useState<FlowFilter>("all");
  const [pendingFlowAction, setPendingFlowAction] = useState<PendingFlowAction | null>(null);
  const [isSubmittingFlowAction, setIsSubmittingFlowAction] = useState(false);
  const [lastRunSummary, setLastRunSummary] = useState<{
    readonly requestId: string;
    readonly taskId?: string;
    readonly assignmentId?: string;
    readonly scheduleId?: string;
    readonly eventTypes: readonly string[];
  } | null>(null);

  const defaultCandidateId = useMemo(
    // Fallback to authenticated user when workspace personnel is not configured yet,
    // so local runtime checks and early-stage workspaces can still execute the flow.
    // Downstream server-side flow handlers still enforce domain transitions and policy limits.
    () =>
      workspace.personnel?.managerId?.trim() ||
      workspace.personnel?.supervisorId?.trim() ||
      authState.user?.id ||
      "",
    [authState.user?.id, workspace.personnel?.managerId, workspace.personnel?.supervisorId],
  );

  const loadSchedule = useCallback(async () => {
    setLoadState("loading");

    try {
      const nextItems = await getWorkspaceSchedule(workspace.id);
      setItems(nextItems);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceScheduleTab] Failed to load schedule signals:", error);
      }
      setItems([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  const loadMdddFlows = useCallback(async () => {
    setFlowLoadState("loading");

    try {
      const nextFlows = await listWorkspaceScheduleMdddFlowProjections(workspace.id);
      setFlowProjections(nextFlows);
      setFlowLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceScheduleTab] Failed to load MDDD flow projections:", error);
      }
      setFlowProjections([]);
      setFlowLoadState("error");
    }
  }, [workspace.id]);

  const reloadAll = useCallback(async () => {
    await Promise.all([loadSchedule(), loadMdddFlows()]);
  }, [loadMdddFlows, loadSchedule]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) {
        return;
      }
      await reloadAll();
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadAll]);

  const handleRunScheduleFlow = useCallback(async () => {
    setRunState("running");
    setRunMessage(null);
    setLastRunSummary(null);

    const now = new Date();
    const startAt = new Date(now.getTime() + 60 * 60 * 1000);
    const endAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const availabilityEndAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const runnerId = defaultCandidateId;
    if (!runnerId) {
      setRunState("error");
      setRunMessage("缺少可用的執行者（manager / supervisor / authenticated user），無法啟動流程。");
      return;
    }
    const runtimeProfile = DEFAULT_SCHEDULE_RUNTIME_PROFILE;

    try {
      const result = await runScheduleMdddFlow({
        workspaceId: workspace.id,
        organization: {
          organizationId: workspace.accountId,
          maxLoadPerMember: runtimeProfile.maxLoadPerMember,
          maxConcurrentAssignmentsPerMember: runtimeProfile.maxConcurrentAssignmentsPerMember,
        },
        requiredSkills: [
          {
            skillId: runtimeProfile.requiredSkillId,
            minLevel: runtimeProfile.requiredSkillLevel,
            requiredHeadcount: runtimeProfile.requiredHeadcount,
          },
        ],
        requiredHeadcount: runtimeProfile.requiredHeadcount,
        actorAccountUserId: runnerId,
        candidates: [
          {
            accountUserId: runnerId,
            teamIds: workspace.teamIds,
            skills: [{ skillId: runtimeProfile.requiredSkillId, level: runtimeProfile.candidateSkillLevel }],
            capabilities: [],
            availability: {
              accountUserId: runnerId,
              windows: [{ startAtISO: now.toISOString(), endAtISO: availabilityEndAt.toISOString() }],
              maxConcurrentAssignments: runtimeProfile.maxConcurrentAssignmentsPerMember,
              maxLoadPerPeriod: runtimeProfile.maxLoadPerMember,
            },
            currentLoadUnits: 0,
          },
        ],
        scheduleSlot: {
          startAtISO: startAt.toISOString(),
          endAtISO: endAt.toISOString(),
          timezone: runtimeProfile.timezone,
          slotType: "planned",
        },
        useScaffoldingFastClose: false,
      });

      if (!result.success || !result.command.success) {
        setRunState("error");
        setRunMessage(
          !result.command.success ? result.command.error.message : "Flow failed unexpectedly.",
        );
        return;
      }

      setRunState("success");
      setRunMessage("Schedule MDDD flow 已完成，請檢查下方執行摘要與流程狀態。");
      setLastRunSummary({
        requestId: result.data.request.requestId,
        taskId: result.data.task?.taskId,
        assignmentId: result.data.assignmentId,
        scheduleId: result.data.scheduleId,
        eventTypes: result.data.events.map((event) => event.type),
      });

      await reloadAll();
    } catch (error) {
      setRunState("error");
      setRunMessage(
        error instanceof Error ? error.message : "Schedule MDDD flow 執行失敗，請稍後再試。",
      );
    }
  }, [defaultCandidateId, reloadAll, workspace.accountId, workspace.id, workspace.teamIds]);

  const handleRejectRequest = useCallback(
    async (requestId: string) => {
      const result = await rejectScheduleRequest({
        requestId,
        reason: "rejected_from_workspace_schedule_tab",
      });

      if (!result.success) {
        setRunState("error");
        setRunMessage(result.error.message);
        return;
      }

      setRunState("success");
      setRunMessage("Request 已拒絕並完成關聯任務回滾。");
      await loadMdddFlows();
    },
    [loadMdddFlows],
  );

  const handleRejectAssignment = useCallback(
    async (assignmentId: string) => {
      const result = await rejectScheduleAssignment({
        assignmentId,
        reason: "rejected_from_workspace_schedule_tab",
      });

      if (!result.success) {
        setRunState("error");
        setRunMessage(result.error.message);
        return;
      }

      setRunState("success");
      setRunMessage("Assignment 已拒絕並更新任務狀態。");
      await loadMdddFlows();
    },
    [loadMdddFlows],
  );

  const handleCancelSchedule = useCallback(
    async (scheduleId: string) => {
      const result = await cancelSchedule({
        scheduleId,
        reason: "cancelled_from_workspace_schedule_tab",
      });

      if (!result.success) {
        setRunState("error");
        setRunMessage(result.error.message);
        return;
      }

      setRunState("success");
      setRunMessage("Schedule 已取消並完成回滾更新。");
      await loadMdddFlows();
    },
    [loadMdddFlows],
  );

  const filteredFlowProjections = useMemo(() => {
    const keyword = flowSearch.trim().toLowerCase();
    return flowProjections.filter((projection) => {
      if (flowFilter === "actionable" && !isActionableProjection(projection)) {
        return false;
      }
      if (flowFilter === "at-risk" && !isAtRiskProjection(projection)) {
        return false;
      }
      if (flowFilter === "completed" && !isCompletedProjection(projection)) {
        return false;
      }
      if (!keyword) {
        return true;
      }

      const searchableFields = [
        projection.requestId,
        projection.taskId,
        projection.assignmentId,
        projection.scheduleId,
        projection.assigneeAccountUserId,
        projection.requestStatus,
        projection.taskStatus,
        projection.assignmentStatus,
        projection.scheduleStatus,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();

      return searchableFields.includes(keyword);
    });
  }, [flowFilter, flowProjections, flowSearch]);

  const flowMetrics = useMemo(() => {
    const actionableCount = flowProjections.filter(isActionableProjection).length;
    const atRiskCount = flowProjections.filter(isAtRiskProjection).length;
    const completedCount = flowProjections.filter(isCompletedProjection).length;

    return {
      total: flowProjections.length,
      actionableCount,
      atRiskCount,
      completedCount,
    };
  }, [flowProjections]);

  const pendingActionMeta = useMemo(() => {
    if (!pendingFlowAction) {
      return null;
    }

    if (pendingFlowAction.kind === "reject-request") {
      return {
        title: "Reject Request",
        description: `將 request ${pendingFlowAction.requestId} 標記為拒絕，並回滾後續任務。`,
        confirmLabel: "確認 Reject",
      };
    }

    if (pendingFlowAction.kind === "reject-assignment") {
      return {
        title: "Reject Assignment",
        description: `將 request ${pendingFlowAction.requestId} 的 assignment 標記為拒絕，流程將回到可再指派狀態。`,
        confirmLabel: "確認拒絕 Assignment",
      };
    }

    return {
      title: "Cancel Schedule",
      description: `取消 request ${pendingFlowAction.requestId} 的既有 schedule，並標記原因以利稽核。`,
      confirmLabel: "確認取消 Schedule",
    };
  }, [pendingFlowAction]);

  const handleConfirmFlowAction = useCallback(async () => {
    if (!pendingFlowAction) {
      return;
    }

    setIsSubmittingFlowAction(true);
    try {
      if (pendingFlowAction.kind === "reject-request") {
        await handleRejectRequest(pendingFlowAction.id);
      } else if (pendingFlowAction.kind === "reject-assignment") {
        await handleRejectAssignment(pendingFlowAction.id);
      } else {
        await handleCancelSchedule(pendingFlowAction.id);
      }
      setPendingFlowAction(null);
    } finally {
      setIsSubmittingFlowAction(false);
    }
  }, [handleCancelSchedule, handleRejectAssignment, handleRejectRequest, pendingFlowAction]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>
          以工作區生命週期與 finance 節點整理目前可追蹤的 milestone / follow-up 行程。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total flows</p>
            <p className="mt-1 text-xl font-semibold">{flowMetrics.total}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Actionable</p>
            <p className="mt-1 text-xl font-semibold">{flowMetrics.actionableCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">At risk</p>
            <p className="mt-1 text-xl font-semibold">{flowMetrics.atRiskCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="mt-1 text-xl font-semibold">{flowMetrics.completedCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Schedule MDDD Runtime</p>
              <p className="text-xs text-muted-foreground">
                直接觸發一次 Request→Task→Match→Assignment→Schedule 流程，並顯示完整狀態轉移。
              </p>
            </div>
            <Button
              type="button"
              onClick={() => void handleRunScheduleFlow()}
              disabled={runState === "running"}
            >
              {runState === "running" ? "執行中…" : "執行 MDDD Flow"}
            </Button>
          </div>

          {runMessage && (
            <p className={cn("mt-3 text-sm", runState === "error" ? "text-destructive" : "text-emerald-600")}>
              {runMessage}
            </p>
          )}

          {lastRunSummary && (
            <div className="mt-3 grid gap-2 rounded-lg border border-border/40 bg-muted/30 p-3 text-xs">
              <p>requestId: {lastRunSummary.requestId}</p>
              <p>taskId: {lastRunSummary.taskId ?? "—"}</p>
              <p>assignmentId: {lastRunSummary.assignmentId ?? "—"}</p>
              <p>scheduleId: {lastRunSummary.scheduleId ?? "—"}</p>
              <p>events: {lastRunSummary.eventTypes.join(" → ") || "—"}</p>
            </div>
          )}
        </div>

        {flowLoadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading MDDD flow projections…</p>
        )}

        {flowLoadState === "error" && (
          <p className="text-sm text-destructive">無法載入 MDDD 流程狀態，請稍後再試。</p>
        )}

        {flowLoadState === "loaded" && flowProjections.length === 0 && (
          <p className="text-sm text-muted-foreground">目前尚無 MDDD flow 狀態資料。</p>
        )}

        {flowProjections.length > 0 && (
          <div className="space-y-3">
            <div className="grid gap-3 rounded-xl border border-border/40 p-4 md:grid-cols-[1fr_auto]">
              <Input
                value={flowSearch}
                onChange={(event) => setFlowSearch(event.target.value)}
                placeholder="搜尋 request / task / assignee / status"
              />
              <select
                value={flowFilter}
                onChange={(event) => setFlowFilter(event.target.value as FlowFilter)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">全部流程</option>
                <option value="actionable">待處理</option>
                <option value="at-risk">高風險</option>
                <option value="completed">已完成</option>
              </select>
            </div>

            {filteredFlowProjections.length === 0 && (
              <p className="text-sm text-muted-foreground">
                目前篩選條件下沒有資料，請調整搜尋關鍵字或篩選條件。
              </p>
            )}

            {filteredFlowProjections.map((projection) => (
              <div
                key={projection.requestId}
                className="rounded-xl border border-border/40 bg-muted/20 px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">requestId: {projection.requestId}</p>
                  <Badge variant={resolveFlowStatusVariant(projection.requestStatus)}>
                    request:{projection.requestStatus}
                  </Badge>
                  <Badge variant={resolveFlowStatusVariant(projection.taskStatus)}>
                    task:{projection.taskStatus ?? "—"}
                  </Badge>
                  <Badge variant={resolveFlowStatusVariant(projection.assignmentStatus)}>
                    assignment:{projection.assignmentStatus ?? "—"}
                  </Badge>
                  <Badge variant={resolveFlowStatusVariant(projection.scheduleStatus)}>
                    schedule:{projection.scheduleStatus ?? "—"}
                  </Badge>
                </div>

                <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                  <p>taskId: {projection.taskId ?? "—"}</p>
                  <p>assignmentId: {projection.assignmentId ?? "—"}</p>
                  <p>scheduleId: {projection.scheduleId ?? "—"}</p>
                  <p>assignee: {projection.assigneeAccountUserId ?? "—"}</p>
                  <p>updated at: {formatUpdatedAt(projection.updatedAtISO)}</p>
                  <p>events: {projection.eventTypes.join(" → ") || "—"}</p>
                  {projection.lastReason && <p>reason: {projection.lastReason}</p>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["submitted", "under-review", "accepted"].includes(projection.requestStatus) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPendingFlowAction({
                          kind: "reject-request",
                          id: projection.requestId,
                          requestId: projection.requestId,
                        })
                      }
                    >
                      Reject Request
                    </Button>
                  )}

                  {projection.assignmentId && projection.assignmentStatus === "proposed" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!projection.assignmentId) {
                          return;
                        }
                        setPendingFlowAction({
                          kind: "reject-assignment",
                          id: projection.assignmentId,
                          requestId: projection.requestId,
                        });
                      }}
                    >
                      Reject Assignment
                    </Button>
                  )}

                  {projection.scheduleId &&
                    projection.scheduleStatus &&
                    ["planned", "reserved", "active", "conflicted"].includes(
                      projection.scheduleStatus,
                    ) && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (!projection.scheduleId) {
                              return;
                            }
                            setPendingFlowAction({
                              kind: "cancel-schedule",
                              id: projection.scheduleId,
                              requestId: projection.requestId,
                            });
                          }}
                        >
                          Cancel Schedule
                        </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog
          open={Boolean(pendingFlowAction)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && !isSubmittingFlowAction) {
              setPendingFlowAction(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{pendingActionMeta?.title ?? "確認操作"}</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingActionMeta?.description ?? "請確認是否執行此操作。"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmittingFlowAction}>返回</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isSubmittingFlowAction}
                onClick={() => void handleConfirmFlowAction()}
              >
                {isSubmittingFlowAction ? "處理中…" : pendingActionMeta?.confirmLabel ?? "確認"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading schedule signals…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入 schedule 資料，請稍後再試。</p>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge variant={statusVariantMap[item.status]}>{item.status}</Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.timeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
