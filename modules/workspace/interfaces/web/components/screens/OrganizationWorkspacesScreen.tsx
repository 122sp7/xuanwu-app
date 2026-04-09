"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import type { WorkspaceEntity } from "../../../../api/contracts";
import { useWorkspaceHub } from "../../hooks/useWorkspaceHub";
import { CreateWorkspaceDialog } from "../dialogs/CreateWorkspaceDialog";

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

interface OrganizationWorkspacesScreenProps {
  readonly accountId: string | null | undefined;
}

export function OrganizationWorkspacesScreen({ accountId }: OrganizationWorkspacesScreenProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    isCreatingWorkspace,
    loadState,
    workspaces,
  } = useWorkspaceHub({ accountId, accountType: "organization" });

  function resetDialog() {
    setWorkspaceName("");
    clearCreateError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await createWorkspaceForAccount(workspaceName);
    if (!result.success) return;
    resetDialog();
    setIsCreateOpen(false);
  }

  if (!accountId) {
    return (
      <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作區</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            組織下所有工作區清單，含 lifecycle 狀態與快速連結。
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetDialog();
            setIsCreateOpen(true);
          }}
        >
          建立工作區
        </Button>
      </div>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        workspaceName={workspaceName}
        createError={createError}
        isCreatingWorkspace={isCreatingWorkspace}
        accountId={accountId}
        onOpenChange={setIsCreateOpen}
        onWorkspaceNameChange={setWorkspaceName}
        onSubmit={handleSubmit}
      />

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <CardDescription>組織下所有工作區清單，含 lifecycle 狀態與快速連結。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">工作區載入中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">無法載入工作區資料，請稍後再試。</p>
          )}
          {loadState === "loaded" && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區。</p>
          )}
          {loadState === "loaded" &&
            workspaces.map((workspace) => (
              <div key={workspace.id} className="rounded-lg border border-border/40 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="link" className="h-auto p-0 text-sm font-medium">
                      <Link href={`/workspace/${workspace.id}`}>{workspace.name}</Link>
                    </Button>
                    <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                      {workspace.lifecycleState}
                    </Badge>
                    <Badge variant="outline">{workspace.visibility}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/workspace/${workspace.id}?tab=Files`}>檔案</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-6 text-xs">
                      <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>
                        知識頁面
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{workspace.id}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
