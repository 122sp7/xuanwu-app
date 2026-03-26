"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

import { useWorkspaceHub } from "../hooks/useWorkspaceHub";

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

interface WorkspaceHubScreenProps {
  readonly accountId: string | null | undefined;
  readonly accountName: string | null | undefined;
  readonly accountType: "user" | "organization";
  readonly accountsHydrated: boolean;
  readonly isBootstrapSeeded: boolean;
}

export function WorkspaceHubScreen({
  accountId,
  accountName,
  accountType,
  accountsHydrated,
  isBootstrapSeeded,
}: WorkspaceHubScreenProps) {
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    errorMessage,
    isCreatingWorkspace,
    loadState,
    workspaceStats,
    workspaces,
  } = useWorkspaceHub({
    accountId,
    accountType,
  });

  function resetCreateWorkspaceDialog() {
    setWorkspaceName("");
    clearCreateError();
  }

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await createWorkspaceForAccount(workspaceName);

    if (!result.success) {
      return;
    }

    resetCreateWorkspaceDialog();
    setIsCreateWorkspaceOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Workspace Hub</h1>
          <p className="text-sm text-muted-foreground">
            Review the workspaces connected to{" "}
            <span className="font-medium text-foreground">
              {accountName ?? "the active account"}
            </span>
            .
          </p>
        </div>

        <Button
          onClick={() => setIsCreateWorkspaceOpen(true)}
          disabled={!accountsHydrated || !accountId}
        >
          {!accountsHydrated ? "同步帳號中…" : "建立工作區"}
        </Button>
      </div>

      {!accountsHydrated && (
        <div
          className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground"
          aria-live="polite"
          role="status"
        >
          {isBootstrapSeeded
            ? "正在同步可用的組織與工作區內容，完成後即可直接建立或切換工作區。"
            : "正在載入帳號與工作區內容…"}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Total Workspaces</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-border/50">
          <CardHeader>
            <CardDescription>Preparatory</CardDescription>
            <CardTitle className="text-3xl">{workspaceStats.preparatory}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Workspace Records</CardTitle>
          <CardDescription>
            Lifecycle, capabilities, locations, and grant counts come directly
            from the workspace module.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
              Loading workspace records…
            </div>
          )}

          {loadState === "error" && errorMessage && (
            <div className="rounded-xl border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {loadState === "loaded" && workspaces.length === 0 && (
            <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
              No workspace records are linked to this account yet. You can keep
              shaping the account context from{" "}
              <Link
                href="/organization"
                className="font-medium text-primary hover:underline"
              >
                organization
              </Link>{" "}
              or{" "}
              <Link
                href="/settings"
                className="font-medium text-primary hover:underline"
              >
                account settings
              </Link>
              .
            </div>
          )}

          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspace/${workspace.id}`}
              className="block rounded-xl border border-border/40 px-4 py-4 shadow-sm transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {workspace.name}
                    </p>
                    <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                      {workspace.lifecycleState}
                    </Badge>
                    <Badge variant="outline">{workspace.visibility}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account scope: {workspace.accountType}
                  </p>
                  <p className="text-xs font-medium text-primary">點擊進入工作區</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-right">
                  <span>Capabilities: {workspace.capabilities.length}</span>
                  <span>Teams: {workspace.teamIds.length}</span>
                  <span>Locations: {workspace.locations?.length ?? 0}</span>
                  <span>Grants: {workspace.grants.length}</span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={isCreateWorkspaceOpen}
        onOpenChange={(open) => {
          setIsCreateWorkspaceOpen(open);
          if (!open) {
            resetCreateWorkspaceDialog();
          }
        }}
      >
        <DialogContent aria-describedby="create-workspace-description">
          <DialogHeader>
            <DialogTitle>建立工作區</DialogTitle>
            <DialogDescription id="create-workspace-description">
              建立後會直接出現在目前帳號的工作區清單中。
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateWorkspace}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="workspace-name"
              >
                工作區名稱
              </label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(event) => {
                  setWorkspaceName(event.target.value);
                  if (createError) {
                    clearCreateError();
                  }
                }}
                placeholder="例如：北區營運中心"
                autoFocus
                disabled={isCreatingWorkspace}
                maxLength={80}
              />
              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetCreateWorkspaceDialog();
                  setIsCreateWorkspaceOpen(false);
                }}
                disabled={isCreatingWorkspace}
              >
                取消
              </Button>
              <Button type="submit" disabled={isCreatingWorkspace || !accountId}>
                {isCreatingWorkspace ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
