"use client";

/**
 * workspace-route-screens — workspace-scoped route screen components.
 *
 * Provides screens rendered within a workspace context:
 *   - WorkspaceDetailRouteScreen  (tabbed workspace detail page)
 *   - WorkspaceHubScreen          (workspace listing / hub for an account)
 *
 * Account/organization-level route screens (AccountDashboard, OrganizationTeams,
 * etc.) belong in platform-ui-stubs because they are platform-owned, not
 * workspace-owned.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import { useWorkspaceContext, type WorkspaceEntity } from "./WorkspaceContext";
import { CreateWorkspaceDialogRail } from "./workspace-shell-interop";
import { WorkspaceDailySection } from "./WorkspaceDailySection";
import { WorkspaceScheduleSection } from "./WorkspaceScheduleSection";
import { WorkspaceAuditSection } from "./WorkspaceAuditSection";
import { WorkspaceFilesSection } from "./WorkspaceFilesSection";
import { WorkspaceMembersSection } from "./WorkspaceMembersSection";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceTaskFormationSection } from "./WorkspaceTaskFormationSection";
import { WorkspaceTasksSection } from "./WorkspaceTasksSection";
import { WorkspaceQualitySection } from "./WorkspaceQualitySection";
import { WorkspaceApprovalSection } from "./WorkspaceApprovalSection";
import { WorkspaceSettlementSection } from "./WorkspaceSettlementSection";
import { WorkspaceIssuesSection } from "./WorkspaceIssuesSection";
import {
  WORKSPACE_TAB_ITEMS,
  resolveWorkspaceTabValue,
  type WorkspaceTabValue,
} from "./workspace-nav-model";

// Cross-module: notion section components (via adapters/inbound/react boundary)
import {
  NotionKnowledgeSection,
  NotionPagesSection,
  NotionDatabaseSection,
  NotionTemplatesSection,
} from "@/src/modules/notion/adapters/inbound/react";

// Cross-module: notebooklm section components (via adapters/inbound/react boundary)
import {
  NotebooklmNotebookSection,
  NotebooklmAiChatSection,
  NotebooklmSourcesSection,
  NotebooklmResearchSection,
} from "@/src/modules/notebooklm/adapters/inbound/react";

// ── Internal helpers ──────────────────────────────────────────────────────────

function getLifecycleBadgeVariant(lifecycleState: WorkspaceEntity["lifecycleState"]) {
  switch (lifecycleState) {
    case "active":
      return "default" as const;
    case "preparatory":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

// ── WorkspaceDetailRouteScreen ────────────────────────────────────────────────

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string;
  accountsHydrated: boolean;
  currentUserId?: string;
  initialTab?: string;
  initialOverviewPanel?: string;
}

export function WorkspaceDetailRouteScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  currentUserId,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailRouteScreenProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: workspaceState } = useWorkspaceContext();

  const activeTab =
    resolveWorkspaceTabValue(searchParams.get("tab") ?? initialTab ?? "Overview") ?? "Overview";
  const activePanel = searchParams.get("panel") ?? initialOverviewPanel ?? null;

  useEffect(() => {
    if (searchParams.get("tab")) return;
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (activePanel) params.set("panel", activePanel);
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`,
    );
  }, [accountId, activePanel, activeTab, router, searchParams, workspaceId]);

  const workspace = workspaceState.workspaces[workspaceId] ?? null;
  if (!workspace) {
    if (!accountsHydrated || !workspaceState.workspacesHydrated) {
      return (
        <div className="px-4 py-6 text-sm text-muted-foreground">工作區載入中…</div>
      ) as React.ReactElement;
    }
    return (
      <div className="space-y-3 px-4 py-6 text-sm text-muted-foreground">
        <p>找不到此工作區或目前帳號沒有存取權。</p>
        <Link
          href={`/${encodeURIComponent(accountId)}`}
          className="text-primary hover:underline"
        >
          返回工作區中心
        </Link>
      </div>
    ) as React.ReactElement;
  }

  const tabHref = (tab: WorkspaceTabValue) =>
    `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=${encodeURIComponent(tab)}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{workspace.name}</h1>
          <Badge variant={getLifecycleBadgeVariant(workspace.lifecycleState)}>
            {workspace.lifecycleState}
          </Badge>
          <Badge variant="outline">{workspace.visibility}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Workspace ID: {workspace.id}</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Workspace tabs">
        {WORKSPACE_TAB_ITEMS.map((tab) => {
          const active = tab.value === activeTab;
          return (
            <Link
              key={tab.id}
              href={tabHref(tab.value)}
              aria-current={active ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <section className="rounded-xl border border-border/40 bg-card/30 p-4">
        {/* ── workspace group ── */}
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <p className="text-sm text-foreground">Workspace Overview</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-pages`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                知識頁面
              </Link>
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=knowledge-base-articles`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                文章
              </Link>
              <Link
                href={`/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=Overview&panel=settings`}
                className="rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                設定
              </Link>
            </div>
            {activePanel && (
              <p className="text-xs text-muted-foreground">當前 Overview panel：{activePanel}</p>
            )}
          </div>
        )}

        {/* ── notion group ── */}
        {activeTab === "Knowledge" && (
          <NotionKnowledgeSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Pages" && (
          <NotionPagesSection
            workspaceId={workspaceId}
            accountId={accountId}
            currentUserId={currentUserId ?? ""}
          />
        )}
        {activeTab === "Database" && (
          <NotionDatabaseSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Templates" && (
          <NotionTemplatesSection workspaceId={workspaceId} accountId={accountId} />
        )}

        {/* ── notebooklm group ── */}
        {activeTab === "Notebook" && (
          <NotebooklmNotebookSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "AiChat" && (
          <NotebooklmAiChatSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Sources" && (
          <NotebooklmSourcesSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Research" && (
          <NotebooklmResearchSection workspaceId={workspaceId} accountId={accountId} />
        )}

        {/* ── workspace group — work execution tabs ── */}
        {activeTab === "Daily" && (
          <WorkspaceDailySection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Schedule" && (
          <WorkspaceScheduleSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Audit" && (
          <WorkspaceAuditSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Files" && (
          <WorkspaceFilesSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Members" && (
          <WorkspaceMembersSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "WorkspaceSettings" && (
          <WorkspaceSettingsSection
            workspaceId={workspaceId}
            accountId={accountId}
            workspace={workspace}
          />
        )}
        {activeTab === "TaskFormation" && (
          <WorkspaceTaskFormationSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Tasks" && (
          <WorkspaceTasksSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Quality" && (
          <WorkspaceQualitySection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Approval" && (
          <WorkspaceApprovalSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Settlement" && (
          <WorkspaceSettlementSection workspaceId={workspaceId} accountId={accountId} />
        )}
        {activeTab === "Issues" && (
          <WorkspaceIssuesSection workspaceId={workspaceId} accountId={accountId} />
        )}
      </section>
    </div>
  ) as React.ReactElement;
}

// ── WorkspaceHubScreen ────────────────────────────────────────────────────────

interface WorkspaceHubScreenProps {
  accountId: string | null;
  accountName: string | null;
  accountType: "organization" | "user" | null;
  accountsHydrated: boolean;
  isBootstrapSeeded: boolean;
  currentUserId: string | null;
}

export function WorkspaceHubScreen({
  accountId,
  accountName,
  accountType,
  accountsHydrated,
  isBootstrapSeeded,
  currentUserId: _currentUserId,
}: WorkspaceHubScreenProps): React.ReactElement {
  const router = useRouter();
  const { state: workspaceState } = useWorkspaceContext();
  const [createOpen, setCreateOpen] = useState(false);

  const workspaceList = useMemo(
    () =>
      Object.values(workspaceState.workspaces)
        .filter((workspace) => !accountId || workspace.accountId === accountId)
        .sort((left, right) => left.name.localeCompare(right.name, "zh-Hant")),
    [accountId, workspaceState.workspaces],
  );

  const stats = useMemo(
    () => ({
      total: workspaceList.length,
      active: workspaceList.filter((workspace) => workspace.lifecycleState === "active").length,
      preparatory: workspaceList.filter(
        (workspace) => workspace.lifecycleState === "preparatory",
      ).length,
    }),
    [workspaceList],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Workspace Hub</h1>
          <p className="text-sm text-muted-foreground">
            {accountName ? `${accountName} 的工作區列表` : "目前帳號的工作區列表"}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={!accountsHydrated || !accountId || !accountType}
        >
          {!accountsHydrated ? "同步帳號中…" : "建立工作區"}
        </Button>
      </div>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          {isBootstrapSeeded
            ? "正在同步可用帳號與工作區資料…"
            : "正在載入帳號與工作區資料…"}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Total Workspaces</p>
          <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-xs text-muted-foreground">Preparatory</p>
          <p className="mt-1 text-2xl font-semibold">{stats.preparatory}</p>
        </div>
      </div>

      <div className="space-y-3">
        {workspaceList.length === 0 ? (
          <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
            目前沒有可用工作區，請先建立一個工作區。
          </div>
        ) : (
          workspaceList.map((workspace) => (
            <Link
              key={workspace.id}
              href={
                accountId
                  ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspace.id)}?tab=Overview`
                  : "/"
              }
              className="block rounded-xl border border-border/40 px-4 py-4 transition hover:bg-muted/40"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{workspace.name}</p>
                  <p className="text-xs text-muted-foreground">{workspace.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getLifecycleBadgeVariant(workspace.lifecycleState)}>
                    {workspace.lifecycleState}
                  </Badge>
                  <Badge variant="outline">{workspace.visibility}</Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <CreateWorkspaceDialogRail
        open={createOpen}
        onOpenChange={setCreateOpen}
        accountId={accountId}
        accountType={accountType}
        onNavigate={(href) => {
          router.push(href);
        }}
      />
    </div>
  ) as React.ReactElement;
}
