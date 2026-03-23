"use client";

import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { WikiBetaPagesTreeView } from "./WikiBetaPagesTreeView";

interface WikiBetaPagesViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

export function WikiBetaPagesWorkspace({ accountId, workspaceId }: WikiBetaPagesViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">Pages</CardTitle>
            {workspaceId ? <Badge variant="secondary">workspace: {workspaceId}</Badge> : null}
          </div>
          <CardDescription>層級化頁面管理工作區，包含建立、改名與父子頁調整。</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          以既有 use-case/domain event 流程為核心，僅優化頁面操作與資訊層可讀性。
        </CardContent>
      </Card>

      <WikiBetaPagesTreeView accountId={accountId} workspaceId={workspaceId} />
    </div>
  );
}

export const WikiBetaPagesView = WikiBetaPagesWorkspace;
