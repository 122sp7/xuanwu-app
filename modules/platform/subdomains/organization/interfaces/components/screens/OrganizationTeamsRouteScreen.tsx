"use client";

import { useAccountRouteContext } from "../../../../../interfaces/web/hooks/useAccountRouteContext";

import { TeamsPage } from "../TeamsPage";

export function OrganizationTeamsRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  return <TeamsPage organizationId={organizationId} />;
}