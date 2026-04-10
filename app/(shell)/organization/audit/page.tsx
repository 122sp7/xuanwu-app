"use client";

import { useApp, isActiveOrganizationAccount, OrganizationAuditPage } from "@/modules/platform/api"

export default function OrganizationAuditPageRoute() {
  const { state: appState } = useApp();
  const { activeAccount, workspaces, workspacesHydrated } = appState;
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return (
    <OrganizationAuditPage
      organizationId={organizationId}
      workspaces={workspaces}
      workspacesHydrated={workspacesHydrated}
    />
  );
}
