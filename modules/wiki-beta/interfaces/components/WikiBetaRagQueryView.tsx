"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { WikiBetaRagTestView } from "./WikiBetaRagTestView";

interface WikiBetaRagQueryViewProps {
  readonly workspaceId?: string;
}

export function WikiBetaRagQueryConsole({ workspaceId }: WikiBetaRagQueryViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">RAG Query</CardTitle>
            {workspaceId ? <Badge variant="secondary">workspace: {workspaceId}</Badge> : null}
          </div>
          <CardDescription>知識問答控制台，顯示回答與引用來源。</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          使用既有 callable/query 邏輯，聚焦 QA 流程與回應可讀性。
        </CardContent>
      </Card>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="query" workspaceId={workspaceId} />
    </div>
  );
}

export const WikiBetaRagQueryView = WikiBetaRagQueryConsole;
