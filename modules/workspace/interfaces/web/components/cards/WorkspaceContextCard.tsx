"use client";

/**
 * WorkspaceContextCard
 * Purpose: display the active workspace context in notebook/ai-chat sidebar.
 * Shows workspace name + navigation links when a workspace is active,
 * otherwise shows an empty-state hint.
 */

import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import type { WorkspaceEntity } from "../../../api/contracts";

interface WorkspaceContextCardProps {
  readonly workspace: WorkspaceEntity | null;
}

export function WorkspaceContextCard({ workspace }: WorkspaceContextCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FolderKanban className="size-4 text-primary" />
          Workspace context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {workspace ? (
          <>
            <div>
              <p className="font-medium text-foreground">{workspace.name}</p>
              <p className="mt-1 text-xs">
                Notebook 會優先消費這個工作區的 Knowledge、知識頁面與 RAG Query 結果。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/${encodeURIComponent(workspace.accountId)}/${encodeURIComponent(workspace.id)}`}>Workspace</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>知識頁面</Link>
              </Button>
            </div>
          </>
        ) : (
          <p className="text-xs">
            尚未帶入工作區。建議從 Workspace Hub 或工作區頁面進入，讓 Notebook 綁定知識上下文。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
