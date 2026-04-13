"use client";

import { useAccountRouteContext } from "@/modules/platform/api";

import { OrganizationWorkspacesScreen } from "./OrganizationWorkspacesScreen";

export function OrganizationWorkspacesRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  return <OrganizationWorkspacesScreen accountId={organizationId} />;
}