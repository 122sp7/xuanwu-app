"use client";

import { useAccountRouteContext } from "../../../../../interfaces/web/hooks/useAccountRouteContext";

import { MembersPage } from "@/modules/iam/subdomains/organization/interfaces/components/MembersPage";

export function OrganizationMembersRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  return <MembersPage organizationId={organizationId} />;
}