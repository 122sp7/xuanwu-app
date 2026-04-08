"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";
import { WorkspaceAuditTab } from "@/modules/workspace-audit/api";
import { WorkspaceFilesTab } from "@/modules/source/api";
import { WorkspaceSchedulingTab } from "@/modules/workspace-scheduling/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace-feed/api";
import { useApp } from "@/app/providers/app-provider";

import {
  createSettingsDraft,
  type WorkspaceSettingsDraft,
} from "../../application/workspace-settings";
import { WorkspaceDailyTab } from "./WorkspaceDailyTab";
import { WorkspaceMembersTab } from "./WorkspaceMembersTab";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabValue,
} from "../workspace-tabs";
import { MOBILE_TAB_GROUP_ORDER } from "./workspace-detail-helpers";
import { WorkspaceOverviewTab } from "./WorkspaceOverviewTab";
import { WorkspaceSettingsDialog } from "./WorkspaceSettingsDialog";
import { useWorkspaceSettingsSave } from "../hooks/useWorkspaceSettingsSave";
import { useWorkspaceDetail } from "../hooks/useWorkspaceDetail";

interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
  /** Optional tab to activate on first render (e.g. from ?tab= URL param). */
  readonly initialTab?: string;
  readonly initialOverviewPanel?: string;
}

export function WorkspaceDetailScreen({
  workspaceId,
  accountId,
  accountsHydrated,
  initialTab,
  initialOverviewPanel,
}: WorkspaceDetailScreenProps) {
  const { state: appState, dispatch } = useApp();
  const { workspace, loadState, setWorkspace } = useWorkspaceDetail(
    workspaceId,
    accountId,
    accountsHydrated,
  );
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<WorkspaceSettingsDraft | null>(null);

  const { isSaving: isSavingWorkspace, saveError, clearSaveError, handleSave } = useWorkspaceSettingsSave({
    workspace,
    accountId,
    onSaved: (updated) => {
      setWorkspace(updated);
      setSettingsDraft(createSettingsDraft(updated));
      setIsEditWorkspaceOpen(false);
    },
  });

  const personnelEntries = useMemo(() => {
    if (!workspace?.personnel) return [];
    return [
      { label: "Manager", value: workspace.personnel.managerId },
      { label: "Supervisor", value: workspace.personnel.supervisorId },
      { label: "Safety officer", value: workspace.personnel.safetyOfficerId },
      ...((workspace.personnel.customRoles ?? []).map((entry) => ({
        label: entry.roleName,
        value: entry.role,
      }))),
    ].filter((entry) => Boolean(entry.value));
  }, [workspace]);

  const addressLines = useMemo(() => {
    if (!workspace?.address) return [];
    const { street, city, state, postalCode, country, details } = workspace.address;
    return [
      street,
      [city, state, postalCode].filter(Boolean).join(", "),
      country,
      details,
    ].filter((line): line is string => Boolean(line));
  }, [workspace]);

  function renderTabContent(tab: WorkspaceTabValue) {
    if (!workspace) return null;

    switch (tab) {
      case "Overview":
        return (
          <WorkspaceOverviewTab
            workspace={workspace}
            activeWorkspaceId={appState.activeWorkspaceId}
            personnelEntries={personnelEntries}
            addressLines={addressLines}
            showSettingsPanel={initialOverviewPanel === "settings"}
            onEditClick={() => {
              setSettingsDraft(createSettingsDraft(workspace));
              clearSaveError();
              setIsEditWorkspaceOpen(true);
            }}
            onSetActiveWorkspace={() =>
              dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspace.id })
            }
          />
        );
      case "Members":
        return <WorkspaceMembersTab workspace={workspace} />;
      case "Daily":
        return <WorkspaceDailyTab workspace={workspace} />;
      case "Files":
        return <WorkspaceFilesTab workspace={workspace} />;
      case "Schedule":
        return (
          <WorkspaceSchedulingTab
            workspace={workspace}
            accountId={accountId ?? workspace.accountId}
            currentUserId={accountId ?? "anonymous"}
          />
        );
      case "Audit":
        return <WorkspaceAuditTab workspaceId={workspace.id} />;
      case "Tasks":
        return <WorkspaceFlowTab workspaceId={workspace.id} currentUserId={accountId ?? "anonymous"} />;
      case "Feed":
        return (
          <WorkspaceFeedWorkspaceView
            accountId={accountId ?? workspace.accountId}
            workspaceId={workspace.id}
            workspaceName={workspace.name}
          />
        );
      default:
        return null;
    }
  }

  const resolvedTab: WorkspaceTabValue = initialTab && isWorkspaceTabValue(initialTab)
    ? initialTab
    : "Overview";

  return (
    <div className="space-y-6">
      <Link href="/workspace" className="inline-flex text-sm font-medium text-primary hover:underline md:hidden">
        ← 返回 Workspace Hub
      </Link>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          正在同步帳號內容…
        </div>
      )}

      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            Loading workspace detail…
          </CardContent>
        </Card>
      )}

      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入工作區資料，請返回清單後重試。
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && !workspace && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            找不到此工作區。
          </CardContent>
        </Card>
      )}

      {workspace && (
        <div className="space-y-6">
          {/* Mobile tab navigation – hidden on md+ where sidebar handles navigation */}
          <nav
            aria-label="Workspace tab navigation"
            className="md:hidden -mx-6 overflow-x-auto border-b border-border/50 px-4 pb-2"
          >
            <div className="flex min-w-max items-center gap-0.5">
              {MOBILE_TAB_GROUP_ORDER.flatMap((group, groupIndex) => {
                const tabs = getWorkspaceTabsByGroup(group);
                const links = tabs.map((tab) => {
                  const isActive = resolvedTab === tab;
                  return (
                    <Link
                      key={tab}
                      href={`/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {getWorkspaceTabLabel(tab)}
                    </Link>
                  );
                });
                if (groupIndex > 0) {
                  return [
                    <div
                      key={`sep-${group}`}
                      aria-hidden="true"
                      className="mx-1.5 h-3.5 w-px shrink-0 bg-border/60"
                    />,
                    ...links,
                  ];
                }
                return links;
              })}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{getWorkspaceTabStatus(resolvedTab)} {getWorkspaceTabLabel(resolvedTab)}</Badge>
          </div>
          {renderTabContent(resolvedTab)}
        </div>
      )}

      <WorkspaceSettingsDialog
        open={isEditWorkspaceOpen}
        onOpenChange={(open) => {
          setIsEditWorkspaceOpen(open);
          if (!open) {
            clearSaveError();
            if (workspace) setSettingsDraft(createSettingsDraft(workspace));
          }
        }}
        settingsDraft={settingsDraft}
        setSettingsDraft={setSettingsDraft}
        isSaving={isSavingWorkspace}
        saveError={saveError}
        onSubmit={(event) => void handleSave(event, settingsDraft)}
      />
    </div>
  );
}
