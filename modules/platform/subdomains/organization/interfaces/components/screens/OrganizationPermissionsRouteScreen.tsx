"use client";

import { useAccountRouteContext } from "../../../../../interfaces/web/hooks/useAccountRouteContext";

import { PermissionsPage } from "../PermissionsPage";

export function OrganizationPermissionsRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  return <PermissionsPage organizationId={organizationId} />;
}