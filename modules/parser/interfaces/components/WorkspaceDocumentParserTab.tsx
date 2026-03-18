"use client";

import { useMemo } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceParserSignalSummary } from "../queries/parser.queries";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceDocumentParserTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDocumentParserTab({ workspace }: WorkspaceDocumentParserTabProps) {
  const parserSummary = useMemo(() => getWorkspaceParserSignalSummary(workspace), [workspace]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Document Parser</CardTitle>
        <CardDescription>
          先整理可解析來源、阻塞原因與下一步，作為後續 parser / knowledge flow 的入口。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Supported sources</p>
            <p className="mt-1 text-xl font-semibold">{parserSummary.supportedSources}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Ready assets</p>
            <p className="mt-1 text-xl font-semibold">{parserSummary.readyAssetCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Blocked reasons</p>
            <p className="mt-1 text-xl font-semibold">{parserSummary.blockedReasons.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Current parser posture</p>
              <Badge variant={parserSummary.blockedReasons.length === 0 ? "secondary" : "outline"}>
                {parserSummary.blockedReasons.length === 0 ? "ready-to-stage" : "needs-input"}
              </Badge>
            </div>
            {parserSummary.blockedReasons.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                已有可用來源，下一步可以把這些資產送進 parser / knowledge pipeline。
              </p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {parserSummary.blockedReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-sm font-semibold text-foreground">Recommended next actions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {parserSummary.nextActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
