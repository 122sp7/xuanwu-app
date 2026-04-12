"use client";

import { useApp } from "@/modules/platform/api";
import { OrganizationWorkspacesScreen } from "@/modules/workspace/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";

export default function OrganizationWorkspacesPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return <OrganizationWorkspacesScreen accountId={activeOrganizationId} />;
}
