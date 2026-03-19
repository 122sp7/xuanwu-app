"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceSchedule } from "../queries/schedule.queries";
import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import { runScheduleMdddFlow } from "../_actions/schedule-mddd.actions";
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
  timezone:
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei"
      : "Asia/Taipei",
} as const;

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const [items, setItems] = useState<readonly WorkspaceScheduleItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
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
      `${workspace.id}-schedule-runner`,
    [workspace.id, workspace.personnel?.managerId, workspace.personnel?.supervisorId],
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) {
        return;
      }
      await loadSchedule();
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadSchedule]);

  async function handleRunScheduleFlow() {
    setRunState("running");
    setRunMessage(null);
    setLastRunSummary(null);

    const now = new Date();
    const startAt = new Date(now.getTime() + 60 * 60 * 1000);
    const endAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const availabilityEndAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const runnerId = defaultCandidateId;
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
        useScaffoldingFastClose: true,
      });

      if (!result.success) {
        setRunState("error");
        setRunMessage(result.command.error.message);
        return;
      }

      setRunState("success");
      setRunMessage("Schedule MDDD flow 已完成，請檢查下方執行摘要。");
      setLastRunSummary({
        requestId: result.data.request.requestId,
        taskId: result.data.task?.taskId,
        assignmentId: result.data.assignmentId,
        scheduleId: result.data.scheduleId,
        eventTypes: result.data.events.map((event) => event.type),
      });

      try {
        await loadSchedule();
      } catch {
        setRunMessage("流程已完成，但重新載入清單失敗，請手動刷新頁面。");
      }
    } catch (error) {
      setRunState("error");
      setRunMessage(
        error instanceof Error ? error.message : "Schedule MDDD flow 執行失敗，請稍後再試。",
      );
    }
  }

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
                直接觸發一次 Request→Task→Match→Assignment→Schedule 流程，驗證契約對應的可見 UI。
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                handleRunScheduleFlow().catch((error) => {
                  setRunState("error");
                  setRunMessage(
                    error instanceof Error
                      ? error.message
                      : "Schedule MDDD flow 執行失敗，請稍後再試。",
                  );
                });
              }}
              disabled={runState === "running"}
            >
              {runState === "running" ? "執行中…" : "執行 MDDD Flow"}
            </Button>
          </div>

          {runMessage && (
            <p className={runState === "error" ? "mt-3 text-sm text-destructive" : "mt-3 text-sm text-emerald-600"}>
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
