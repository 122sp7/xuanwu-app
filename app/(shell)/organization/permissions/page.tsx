"use client";

import { useApp } from "@/app/providers/app-provider";
import { isActiveOrganizationAccount, PermissionsPage } from "@/modules/platform/api";

export default function OrganizationPermissionsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <PermissionsPage organizationId={organizationId} />;
}
