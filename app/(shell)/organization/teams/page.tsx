"use client";

import { useApp } from "@/app/providers/app-provider";
import { isActiveOrganizationAccount, TeamsPage } from "@/modules/platform/api";

export default function OrganizationTeamsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <TeamsPage organizationId={organizationId} />;
}
