"use client";

/**
 * WorkspaceScheduleSection — workspace.schedule tab — project timeline / milestones.
 */

import { Badge, Button } from "@packages";
import { CalendarRange, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import type { WorkDemandSnapshot } from "../../../subdomains/schedule/domain/entities/WorkDemand";
import { createWorkDemandAction } from "../server-actions/schedule-actions";
const scheduleUseCases = createClientScheduleUseCases();

interface WorkspaceScheduleSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

export function WorkspaceScheduleSection({
  workspaceId,
  accountId,
  currentUserId,
}: WorkspaceScheduleSectionProps): React.ReactElement {
  const { listWorkDemandsByWorkspace } = scheduleUseCases;
  const [period, setPeriod] = useState("本週");
  const [demands, setDemands] = useState<WorkDemandSnapshot[]>([]);
  const [isCreatingBaseline, setIsCreatingBaseline] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadDemands(): Promise<void> {
    const result = await listWorkDemandsByWorkspace.execute(workspaceId);
    setDemands(result);
  }

  useEffect(() => {
    let active = true;
    void listWorkDemandsByWorkspace.execute(workspaceId).then((result) => {
      if (active) setDemands(result);
    }).catch(() => {
      if (active) setDemands([]);
    });
    return () => { active = false; };
  }, [listWorkDemandsByWorkspace, workspaceId]);

  async function handleCreateBaseline(): Promise<void> {
    if (!currentUserId) {
      setCreateError("尚未取得操作者身分，請重新登入後再試。");
      return;
    }
    setIsCreatingBaseline(true);
    setCreateError(null);
    const now = new Date();
    const baselineDate = new Date(now);
    baselineDate.setDate(now.getDate() + 7);
    const result = await createWorkDemandAction({
      workspaceId,
      accountId,
      requesterId: currentUserId,
      title: "基線里程碑",
      description: "初始化工作區排程基線",
      priority: "medium",
      scheduledAt: baselineDate.toISOString(),
    });
    if (!result.success) {
      setCreateError(result.error.message);
      setIsCreatingBaseline(false);
      return;
    }
    await loadDemands();
    setIsCreatingBaseline(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">排程</h2>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleCreateBaseline()} disabled={isCreatingBaseline}>
          <Plus className="size-3.5" />
          {isCreatingBaseline ? "建立中…" : "建立基線"}
        </Button>
      </div>

      {createError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {createError}
        </p>
      )}

      {/* Phase labels */}
      <div className="flex flex-wrap gap-2">
        {["本週", "本月", "季度", "全部"].map((value) => (
          <Badge
            key={value}
            variant={period === value ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setPeriod(value)}
          >
            {value}
          </Badge>
        ))}
      </div>

      {demands.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{demand.title}</p>
                <p className="text-xs text-muted-foreground">{demand.scheduledAt}</p>
              </div>
              <Badge variant={demand.status === "completed" ? "default" : "outline"}>
                {demand.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative space-y-0 overflow-hidden rounded-xl border border-border/40 bg-card/30">
          <div className="absolute left-6 top-0 h-full w-px bg-border/30" />
          <div className="px-4 py-8 text-center">
            <CalendarRange className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">尚無排程里程碑</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              建立里程碑後，時間軸將顯示專案進度與截止日期。
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => void handleCreateBaseline()}
              disabled={isCreatingBaseline}
            >
              <Plus className="size-3.5" />
              {isCreatingBaseline ? "建立中…" : "建立第一個基線"}
            </Button>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
