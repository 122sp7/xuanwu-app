import type { ReactNode } from "react";

import { WorkspaceAuditTab } from "../../../../subdomains/audit/api";
import { WorkspaceFeedWorkspaceView } from "../../../../subdomains/feed/api";
import { WorkspaceSchedulingTab } from "../../../../subdomains/scheduling/api";
import { WorkspaceFlowTab } from "../../../../subdomains/orchestration/api";
import { WorkspaceNotificationPreferencesPanel } from "@/modules/platform/subdomains/notification/api";
import type { WorkspaceEntity } from "../../../../domain/aggregates/Workspace";
import type { WorkspaceTabValue } from "../../navigation/workspace-tabs";
import {
  getWorkspaceAddressLines,
  getWorkspacePersonnelEntries,
} from "../../view-models/workspace-supporting-records";
import { WorkspaceDailyTab } from "./WorkspaceDailyTab";
import { WorkspaceFilesManagementTab } from "./WorkspaceFilesManagementTab";
import { WorkspaceMembersTab } from "./WorkspaceMembersTab";
import { WorkspaceOverviewTab } from "./WorkspaceOverviewTab";
import { renderWorkspaceCrossModuleTabSurface } from "./WorkspaceCrossModuleTabSurface";

interface WorkspaceDetailTabContentOptions {
  readonly tab: WorkspaceTabValue;
  readonly workspace: WorkspaceEntity;
  readonly accountId: string | null | undefined;
  readonly currentUserId: string | undefined;
  readonly workspaces: Record<string, WorkspaceEntity>;
  readonly activeWorkspaceId: string | null;
  readonly initialOverviewPanel?: string;
  readonly onEditWorkspace: () => void;
  readonly onSetActiveWorkspace: (workspaceId: string) => void;
}

export function renderWorkspaceDetailTabContent({
  tab,
  workspace,
  accountId,
  currentUserId,
  workspaces,
  activeWorkspaceId,
  initialOverviewPanel,
  onEditWorkspace,
  onSetActiveWorkspace,
}: WorkspaceDetailTabContentOptions): ReactNode {
  const crossModuleTabContent = renderWorkspaceCrossModuleTabSurface({
    tab,
    workspace,
    accountId: accountId ?? workspace.accountId,
    currentUserId,
    workspaces,
  });
  if (crossModuleTabContent) {
    return crossModuleTabContent;
  }

  const flowSection: Record<string, "tasks" | "qa" | "acceptance" | "issues" | "invoices"> = {
    Tasks: "tasks",
    TaskQa: "qa",
    TaskAcceptance: "acceptance",
    TaskIssues: "issues",
    TaskFinance: "invoices",
  };

  if (tab in flowSection) {
    return (
      <WorkspaceFlowTab
        workspaceId={workspace.id}
        currentUserId={accountId ?? "anonymous"}
        initialSection={flowSection[tab]}
      />
    );
  }

  const overviewPanel: Record<string, string> = {
    KnowledgePages: "knowledge-pages",
    WorkspaceSettings: "settings",
  };

  const personnelEntries = getWorkspacePersonnelEntries(workspace);
  const addressLines = getWorkspaceAddressLines(workspace);

  switch (tab) {
    case "Overview":
    case "KnowledgePages":
    case "WorkspaceSettings":
      return (
        <WorkspaceOverviewTab
          workspace={workspace}
          activeWorkspaceId={activeWorkspaceId}
          currentUserId={currentUserId}
          personnelEntries={personnelEntries}
          addressLines={addressLines}
          initialPanel={overviewPanel[tab] ?? initialOverviewPanel}
          onEditClick={onEditWorkspace}
          onSetActiveWorkspace={() => onSetActiveWorkspace(workspace.id)}
        />
      );
    case "Members":
      return <WorkspaceMembersTab workspace={workspace} />;
    case "Daily":
      return <WorkspaceDailyTab workspace={workspace} />;
    case "Files":
      return <WorkspaceFilesManagementTab workspace={workspace} />;
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
    case "Notifications":
      if (!currentUserId) {
        return null;
      }
      return (
        <WorkspaceNotificationPreferencesPanel
          workspaceId={workspace.id}
          memberId={currentUserId}
        />
      );
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
