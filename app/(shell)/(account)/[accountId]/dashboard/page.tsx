"use client";

import { useParams } from "next/navigation";

import {
  isActiveOrganizationAccount,
  useApp,
  useAuth,
} from "@/modules/platform/api";
import { AccountDashboardScreen, useWorkspaceContext } from "@/modules/workspace/api";

export default function AccountDashboardPage() {
  const params = useParams<{ accountId: string }>();
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";

  const {
    state: { activeAccount, accounts, accountsHydrated },
  } = useApp();
  const { state: authState } = useAuth();
  const { state: wsState } = useWorkspaceContext();

  const resolvedAccountId = routeAccountId || activeAccount?.id || "";
  const authUserId = authState.user?.id ?? null;
  const authUserName = authState.user?.name ?? null;

  const organizationAccount = Object.values(accounts).find(
    (account) => account.id === resolvedAccountId,
  );

  const accountName =
    resolvedAccountId === authUserId
      ? authUserName
      : organizationAccount?.name ??
        (resolvedAccountId === activeAccount?.id ? activeAccount?.name : null);

  const accountType = isActiveOrganizationAccount(activeAccount)
    ? "organization"
    : "user";

  const workspaces = Object.values(wsState.workspaces ?? {});

  return (
    <AccountDashboardScreen
      accountId={resolvedAccountId}
      accountName={accountName}
      accountType={accountType}
      workspaces={workspaces}
      workspacesHydrated={accountsHydrated}
      activeWorkspaceId={wsState.activeWorkspaceId}
      currentUserId={authUserId}
    />
  );
}
