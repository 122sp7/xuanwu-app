"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { useWorkspaceHub } from "../hooks/useWorkspaceHub";
import { getWorkspaceGovernanceSummary } from "../workspace-supporting-records";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

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
  const router = useRouter();
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
    if (result.aggregateId) {
      router.push(`/workspace/${result.aggregateId}`);
    }
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
          <CardTitle>Workspace-first Product Spine</CardTitle>
          <CardDescription>
            目前先把主流程收斂成 Identity → Organization → Workspace，再由工作區承接 Knowledge、知識頁面、Notebook / AI。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Entry flow</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1. Identity</span>：登入後先建立個人／組織帳號情境。
              </li>
              <li>
                <span className="font-medium text-foreground">2. Organization</span>：切換至目標 account / organization。
              </li>
              <li>
                <span className="font-medium text-foreground">3. Workspace</span>：進入工作區後再分流到知識、知識頁面、Notebook / AI。
              </li>
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Knowledge</p>
              <p className="mt-1 text-xs text-muted-foreground">
                文件、來源、Libraries 與 upload / ingest 流程都由工作區承接。
              </p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">知識頁面</p>
              <p className="mt-1 text-xs text-muted-foreground">
                頁面樹、內容導覽與知識結構直接從工作區知識頁面進入。
              </p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
              <p className="mt-1 text-xs text-muted-foreground">
                問答、推理與 RAG 查詢作為工作區內的消費層，而非獨立入口。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Workspace Records</CardTitle>
          <CardDescription>
            Lifecycle 與 supporting governance records 目前仍由 workspace 模組擁有，但已收斂在專用 supporting ports；點入後會以工作區為樞紐進入 Knowledge / 知識頁面 / Notebook-AI。
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
              目前這個帳號尚未建立任何工作區。你可以先完成{" "}
              <Link
                href="/organization"
                className="font-medium text-primary hover:underline"
              >
                組織情境
              </Link>{" "}
              設定，再使用上方的建立工作區入口，回到 workspace-first 主流程。
            </div>
          )}

          {workspaces.map((workspace) => {
            const governanceSummary = getWorkspaceGovernanceSummary(workspace);

            return (
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
                    <span>Capabilities: {governanceSummary.capabilityCount}</span>
                    <span>Teams: {governanceSummary.teamCount}</span>
                    <span>Locations: {governanceSummary.locationCount}</span>
                    <span>Grants: {governanceSummary.grantCount}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <CreateWorkspaceDialog
        open={isCreateWorkspaceOpen}
        workspaceName={workspaceName}
        createError={createError}
        isCreatingWorkspace={isCreatingWorkspace}
        accountId={accountId}
        onOpenChange={(open) => {
          setIsCreateWorkspaceOpen(open);
          if (!open) resetCreateWorkspaceDialog();
        }}
        onWorkspaceNameChange={(name) => {
          setWorkspaceName(name);
          if (createError) clearCreateError();
        }}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
}
