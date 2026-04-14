"use client";

import { useMemo } from "react";

import { useAuth } from "@/modules/iam/api";
import { useAccountRouteContext, useApp } from "@/modules/platform/api/ui";

import { getWorkspaceStorageKey } from "../../state/workspace-session";
import { useWorkspaceHub } from "../../hooks/useWorkspaceHub";
import { AccountDashboardScreen } from "./AccountDashboardScreen";

export function AccountDashboardRouteScreen() {
  const {
    resolvedAccountId,
    currentUserId,
    accountType,
    accountsHydrated,
    isResolvingOrganizationRoute,
  } = useAccountRouteContext();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { workspaces } = useWorkspaceHub({
    accountId: isResolvingOrganizationRoute ? null : resolvedAccountId || null,
    accountType,
    creatorUserId: currentUserId,
  });

  const activeWorkspaceId = useMemo(() => {
    if (typeof window === "undefined" || !resolvedAccountId) {
      return null;
    }

    return window.localStorage.getItem(getWorkspaceStorageKey(resolvedAccountId)) || null;
  }, [resolvedAccountId]);

  if (isResolvingOrganizationRoute) {
    return (
      <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
        正在同步帳號內容…
      </div>
    );
  }

  const accountName =
    resolvedAccountId === currentUserId
      ? authState.user?.name ?? null
      : appState.accounts[resolvedAccountId]?.name ??
        (resolvedAccountId === appState.activeAccount?.id ? appState.activeAccount?.name : null);

  return (
    <AccountDashboardScreen
      accountId={resolvedAccountId}
      accountName={accountName}
      accountType={accountType}
      workspaces={workspaces}
      workspacesHydrated={accountsHydrated}
      activeWorkspaceId={activeWorkspaceId}
      currentUserId={currentUserId}
    />
  );
}