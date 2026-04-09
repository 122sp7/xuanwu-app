"use client";

import { useApp } from "@/app/providers/app-provider";
import { OrganizationWorkspacesScreen } from "@/modules/workspace/interfaces/web";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationWorkspacesPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return <OrganizationWorkspacesScreen accountId={activeOrganizationId} />;
}
