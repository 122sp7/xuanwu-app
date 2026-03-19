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

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  upcoming: "default",
  scheduled: "outline",
  completed: "secondary",
} as const;

const DEFAULT_SCHEDULE_RUNTIME_PROFILE = {
  maxLoadPerMember: 4,
  maxConcurrentAssignmentsPerMember: 2,
  requiredSkillId: "schedule.coordination",
  requiredSkillLevel: "junior" as const,
  candidateSkillLevel: "senior" as const,
  requiredHeadcount: 1,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei",
} as const;

function invokeHandlerIfIdExists(id: string | null, handler: (value: string) => Promise<void>) {
  if (!id) {
    return;
  }

  void handler(id);
}

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

function formatUpdatedAt(iso: string): string {
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) {
    return iso;
  }

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const { state: authState } = useAuth();
  const [items, setItems] = useState<readonly WorkspaceScheduleItem[]>([]);
  const [flowProjections, setFlowProjections] = useState<readonly ScheduleMdddFlowProjection[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [flowLoadState, setFlowLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [runState, setRunState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [lastRunSummary, setLastRunSummary] = useState<{
    readonly requestId: string;
    readonly taskId?: string;
    readonly assignmentId?: string;
    readonly scheduleId?: string;
    readonly eventTypes: readonly string[];
  } | null>(null);

  const defaultCandidateId = useMemo(
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

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>
          以工作區生命週期與 finance 節點整理目前可追蹤的 milestone / follow-up 行程。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {flowProjections.map((projection) => (
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
                  <p>updatedAt: {formatUpdatedAt(projection.updatedAtISO)}</p>
                  <p>events: {projection.eventTypes.join(" → ") || "—"}</p>
                  {projection.lastReason && <p>reason: {projection.lastReason}</p>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["submitted", "under-review", "accepted"].includes(projection.requestStatus) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleRejectRequest(projection.requestId)}
                    >
                      Reject Request
                    </Button>
                  )}

                  {projection.assignmentId && projection.assignmentStatus === "proposed" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        invokeHandlerIfIdExists(projection.assignmentId, handleRejectAssignment)
                      }
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
                        onClick={() =>
                          invokeHandlerIfIdExists(projection.scheduleId, handleCancelSchedule)
                        }
                      >
                        Cancel Schedule
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading schedule signals…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入 schedule 資料，請稍後再試。</p>
        )}

        <div className="space-y-3">
          {items.length === 0 && loadState === "loaded" ? (
            <p className="text-sm text-muted-foreground">目前尚無 schedule milestone / follow-up 資料。</p>
          ) : (
            items.map((item) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
