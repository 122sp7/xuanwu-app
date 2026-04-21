"use client";

/**
 * WorkspaceScheduleSection — workspace.schedule tab — workspace work-demand schedule view.
 */

import { Badge } from "@packages";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import type { WorkDemandSnapshot } from "../../../subdomains/schedule/domain/entities/WorkDemand";
const scheduleUseCases = createClientScheduleUseCases();

interface WorkspaceScheduleSectionProps {
  workspaceId: string;
}

export function WorkspaceScheduleSection({
  workspaceId,
}: WorkspaceScheduleSectionProps): React.ReactElement {
  const { listWorkDemandsByWorkspace } = scheduleUseCases;
  const [period, setPeriod] = useState("本週");
  const [demands, setDemands] = useState<WorkDemandSnapshot[]>([]);

  useEffect(() => {
    let active = true;
    void listWorkDemandsByWorkspace.execute(workspaceId).then((result) => {
      if (active) setDemands(result);
    }).catch(() => {
      if (active) setDemands([]);
    });
    return () => { active = false; };
  }, [listWorkDemandsByWorkspace, workspaceId]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarRange className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">排程</h2>
      </div>

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
            <p className="text-sm font-medium text-muted-foreground">尚無工作排程需求</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              目前此工作區尚未提出待排程事項。
            </p>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
