"use client";

import Link from "next/link";
import { BookOpenIcon, Building2Icon, FolderKanbanIcon } from "lucide-react";

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

interface WorkspaceWikiBetaViewProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceWikiBetaView({ workspace }: WorkspaceWikiBetaViewProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpenIcon className="size-5 text-primary" />
              {workspace.name} WorkSpace Wiki-Beta
            </CardTitle>
            <CardDescription>
              這是 workspace-scoped 的 Wiki-Beta。所有資料與操作都約束在目前 Account 與 Workspace。
            </CardDescription>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Account Scope</p>
              <p className="mt-1 flex items-center gap-2 font-medium text-foreground">
                <Building2Icon className="size-4 text-primary" />
                {workspace.accountId}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Workspace Scope</p>
              <p className="mt-1 flex items-center gap-2 font-medium text-foreground">
                <FolderKanbanIcon className="size-4 text-primary" />
                {workspace.id}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/wiki-beta">前往 Account Wiki-Beta</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/wiki-beta/pages">查看 Account 頁面總覽</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/wiki-beta/rag-query">前往 RAG Query</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
