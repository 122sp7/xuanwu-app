"use client";

import { useApp, isActiveOrganizationAccount, PermissionsPage } from "@/modules/platform/api"

export default function OrganizationPermissionsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <PermissionsPage organizationId={organizationId} />;
}
