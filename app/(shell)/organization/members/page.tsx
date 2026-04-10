"use client";

import { useApp } from "@/app/providers/app-provider";
import { isActiveOrganizationAccount, MembersPage } from "@/modules/platform/api";

export default function OrganizationMembersPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <MembersPage organizationId={organizationId} />;
}
