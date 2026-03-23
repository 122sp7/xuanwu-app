"use client";

import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { WikiBetaLibrariesView } from "./WikiBetaLibrariesView";

interface WikiBetaLibrariesTableViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

export function WikiBetaLibrariesWorkspace({ accountId, workspaceId }: WikiBetaLibrariesTableViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">Libraries</CardTitle>
            {workspaceId ? <Badge variant="secondary">workspace: {workspaceId}</Badge> : null}
          </div>
          <CardDescription>Notion-like 結構化資料工作區，包含欄位定義與資料列管理。</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          保持既有 domain/application 邏輯，僅提升頁面資訊層與操作入口組織。
        </CardContent>
      </Card>

      <WikiBetaLibrariesView accountId={accountId} workspaceId={workspaceId} />
    </div>
  );
}

export const WikiBetaLibrariesTableView = WikiBetaLibrariesWorkspace;
