"use client";

import { useMemo } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceAcceptanceSummary } from "../queries/acceptance.queries";
import { Badge } from "@ui-shadcn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn";

interface WorkspaceAcceptanceTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceAcceptanceTab({ workspace }: WorkspaceAcceptanceTabProps) {
  const summary = useMemo(() => getWorkspaceAcceptanceSummary(workspace), [workspace]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Acceptance</CardTitle>
        <CardDescription>
          先以 workspace readiness gates 追蹤目前是否具備進入 acceptance flow 的條件。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/40 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Current decision</p>
              <Badge variant={summary.overallReady ? "secondary" : "outline"}>
                {summary.overallReady ? "ready-for-acceptance" : "needs-preparation"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {summary.overallReady
                ? "目前所有 acceptance gates 都已具備，可進一步補上正式驗收流程。"
                : "仍有前置條件未完成，建議先補齊再進入正式 acceptance。"}
            </p>
        </div>

        <div className="space-y-3">
          {summary.gates.map((gate) => (
            <div key={gate.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{gate.label}</p>
                  <p className="text-sm text-muted-foreground">{gate.detail}</p>
                </div>
                <Badge variant={gate.status === "ready" ? "secondary" : "outline"}>
                  {gate.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
