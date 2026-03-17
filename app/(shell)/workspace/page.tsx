"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useApp } from "@/app/providers/app-provider";
import type { WorkspaceEntity } from "@/modules/workspace";
import { createWorkspace, getWorkspacesForAccount } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/ui/dialog";
import { Input } from "@/ui/shadcn/ui/input";

type LoadState = "idle" | "loading" | "loaded" | "error";

const lifecycleBadgeVariant: Record<WorkspaceEntity["lifecycleState"], "default" | "secondary" | "outline"> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

function sortWorkspaces(items: WorkspaceEntity[]) {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "en", { sensitivity: "base" }),
  );
}

export default function WorkspacePage() {
  const {
    state: { activeAccount },
  } = useApp();
  const [workspaces, setWorkspaces] = useState<WorkspaceEntity[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspaces() {
      if (!activeAccount?.id) {
        setWorkspaces([]);
        setLoadState("loaded");
        setErrorMessage(null);
        return;
      }

      setLoadState("loading");
      setErrorMessage(null);

      try {
        const nextWorkspaces = await getWorkspacesForAccount(activeAccount.id);
        if (cancelled) return;
        setWorkspaces(sortWorkspaces(nextWorkspaces));
        setLoadState("loaded");
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspacePage] Failed to load workspaces:", error);
        }
        setWorkspaces([]);
        setLoadState("error");
        setErrorMessage("Unable to load workspace records right now.");
      }
    }

    void loadWorkspaces();

    return () => {
      cancelled = true;
    };
  }, [activeAccount?.id]);

  async function refreshWorkspaces(accountId: string) {
    const nextWorkspaces = await getWorkspacesForAccount(accountId);
    setWorkspaces(sortWorkspaces(nextWorkspaces));
    setLoadState("loaded");
  }

  function resetCreateWorkspaceDialog() {
    setWorkspaceName("");
    setWorkspaceError(null);
    setIsCreatingWorkspace(false);
  }

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeAccount?.id) {
      setWorkspaceError("Select an active account before creating a workspace.");
      return;
    }

    const nextWorkspaceName = workspaceName.trim();
    if (!nextWorkspaceName) {
      setWorkspaceError("請輸入工作區名稱。");
      return;
    }

    setIsCreatingWorkspace(true);
    setWorkspaceError(null);

    const result = await createWorkspace({
      name: nextWorkspaceName,
      accountId: activeAccount.id,
      accountType:
        "accountType" in activeAccount && activeAccount.accountType === "organization"
          ? "organization"
          : "user",
    });

    if (!result.success) {
      setWorkspaceError(result.error.message);
      setIsCreatingWorkspace(false);
      return;
    }

    await refreshWorkspaces(activeAccount.id);
    resetCreateWorkspaceDialog();
    setIsCreateWorkspaceOpen(false);
  }

  const workspaceStats = useMemo(() => {
    return {
      total: workspaces.length,
      active: workspaces.filter((workspace) => workspace.lifecycleState === "active").length,
      preparatory: workspaces.filter((workspace) => workspace.lifecycleState === "preparatory").length,
    };
  }, [workspaces]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Workspace Hub</h1>
          <p className="text-sm text-muted-foreground">
            Review the workspaces connected to{" "}
            <span className="font-medium text-foreground">{activeAccount?.name ?? "the active account"}</span>
            .
          </p>
        </div>

        <Button onClick={() => setIsCreateWorkspaceOpen(true)} disabled={!activeAccount?.id}>
          建立工作區
        </Button>
      </div>

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
            Lifecycle, capabilities, locations, and grant counts come directly from the workspace module.
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
              No workspace records are linked to this account yet. You can keep shaping the account context from{" "}
              <Link href="/organization" className="font-medium text-primary hover:underline">
                organization
              </Link>{" "}
              or{" "}
              <Link href="/settings" className="font-medium text-primary hover:underline">
                account settings
              </Link>
              .
            </div>
          )}

          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="rounded-xl border border-border/40 px-4 py-4 shadow-sm transition hover:bg-muted/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{workspace.name}</p>
                    <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                      {workspace.lifecycleState}
                    </Badge>
                    <Badge variant="outline">{workspace.visibility}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account scope: {workspace.accountType}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-right">
                  <span>Capabilities: {workspace.capabilities.length}</span>
                  <span>Teams: {workspace.teamIds.length}</span>
                  <span>Locations: {workspace.locations?.length ?? 0}</span>
                  <span>Grants: {workspace.grants.length}</span>
                </div>
              </div>
            </div>
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
              <label className="text-sm font-medium text-foreground" htmlFor="workspace-name">
                工作區名稱
              </label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(event) => {
                  setWorkspaceName(event.target.value);
                  if (workspaceError) {
                    setWorkspaceError(null);
                  }
                }}
                placeholder="例如：北區營運中心"
                autoFocus
                disabled={isCreatingWorkspace}
                maxLength={80}
              />
              {workspaceError && <p className="text-sm text-destructive">{workspaceError}</p>}
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
              <Button type="submit" disabled={isCreatingWorkspace || !activeAccount?.id}>
                {isCreatingWorkspace ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
