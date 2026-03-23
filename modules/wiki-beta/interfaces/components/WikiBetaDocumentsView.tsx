"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { WikiBetaRagTestView } from "./WikiBetaRagTestView";

interface WikiBetaDocumentsViewProps {
  readonly workspaceId?: string;
}

export function WikiBetaDocumentsWorkspace({ workspaceId }: WikiBetaDocumentsViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">Documents</CardTitle>
            {workspaceId ? <Badge variant="secondary">workspace: {workspaceId}</Badge> : null}
          </div>
          <CardDescription>文件上傳、處理狀態與 RAG 索引管理。</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          支援 account-scoped 檢視，並可透過 workspaceId 聚焦指定工作區。
        </CardContent>
      </Card>

      <WikiBetaRagTestView onBack={() => router.push("/wiki-beta")} mode="documents" workspaceId={workspaceId} />
    </div>
  );
}

export const WikiBetaDocumentsView = WikiBetaDocumentsWorkspace;
