"use client";

import { useMemo } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceQualityChecks } from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceQATabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  pass: "secondary",
  warn: "outline",
  fail: "default",
} as const;

export function WorkspaceQATab({ workspace }: WorkspaceQATabProps) {
  const checks = useMemo(() => getWorkspaceQualityChecks(workspace), [workspace]);
  const passCount = useMemo(
    () => checks.filter((check) => check.status === "pass").length,
    [checks],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>QA</CardTitle>
        <CardDescription>
          根據工作區設定完整度整理目前的 quality checks，方便先做遷移期自檢。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Checks</p>
            <p className="mt-1 text-xl font-semibold">{checks.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Passing</p>
            <p className="mt-1 text-xl font-semibold">{passCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Needs review</p>
            <p className="mt-1 text-xl font-semibold">{checks.length - passCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{check.label}</p>
                  <p className="text-sm text-muted-foreground">{check.detail}</p>
                </div>
                <Badge variant={statusVariantMap[check.status]}>{check.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
