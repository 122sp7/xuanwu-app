"use client";

import { useApp, isActiveOrganizationAccount } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";
import { OrganizationAuditPage } from "./_components/OrganizationAuditPage";

export default function OrganizationAuditPageRoute() {
  const { state: appState } = useApp();
  const { state: wsState } = useWorkspaceContext();
  const { activeAccount } = appState;
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return (
    <OrganizationAuditPage
      organizationId={organizationId}
      workspaces={wsState.workspaces}
      workspacesHydrated={wsState.workspacesHydrated}
    />
  );
}
