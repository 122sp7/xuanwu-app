"use client";

import { useParams } from "next/navigation";

import { isActiveOrganizationAccount, useAuth } from "@/modules/iam/api";
import { useApp } from "../providers/ShellAppContext";

export interface AccountRouteContext {
  readonly routeAccountId: string;
  readonly resolvedAccountId: string;
  readonly currentUserId: string | null;
  readonly organizationId: string | null;
  readonly accountType: "user" | "organization";
  readonly accountsHydrated: boolean;
  readonly isResolvingOrganizationRoute: boolean;
}

function normalizeRouteParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value?.trim() ?? "";
}

export function useAccountRouteContext(): AccountRouteContext {
  const routeParams = useParams<{ accountId?: string | string[] }>();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const routeAccountId = normalizeRouteParam(routeParams.accountId);
  const currentUserId = authState.user?.id ?? null;
  const fallbackAccountId = appState.activeAccount?.id ?? currentUserId ?? "";
  const resolvedAccountId = routeAccountId || fallbackAccountId;
  const routeOrganization = routeAccountId
    ? appState.accounts[routeAccountId] ?? null
    : null;
  const fallbackOrganizationId = isActiveOrganizationAccount(appState.activeAccount)
    ? appState.activeAccount.id
    : null;

  const isResolvingOrganizationRoute = Boolean(
    routeAccountId &&
      routeAccountId !== currentUserId &&
      !routeOrganization &&
      !appState.accountsHydrated,
  );

  const organizationId = routeOrganization?.id ?? (routeAccountId ? null : fallbackOrganizationId);

  const accountType: "user" | "organization" = routeOrganization
    ? "organization"
    : resolvedAccountId && currentUserId && resolvedAccountId === currentUserId
      ? "user"
      : organizationId
        ? "organization"
        : "user";

  return {
    routeAccountId,
    resolvedAccountId,
    currentUserId,
    organizationId,
    accountType,
    accountsHydrated: appState.accountsHydrated,
    isResolvingOrganizationRoute,
  };
}