"use client";

import type { ActiveAccount } from "@/app/providers/app-context";
import { useApp } from "@/app/providers/app-provider";
import { WorkspaceHubScreen } from "@/modules/workspace";

function isOrganizationAccount(activeAccount: ActiveAccount | null): activeAccount is ActiveAccount & { accountType: "organization" } {
  return Boolean(activeAccount && "accountType" in activeAccount && activeAccount.accountType === "organization");
}

function getActiveAccountType(activeAccount: ActiveAccount | null) {
  return isOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function WorkspacePage() {
  const {
    state: { activeAccount, accountsHydrated, bootstrapPhase },
  } = useApp();

  return (
    <WorkspaceHubScreen
      accountId={activeAccount?.id}
      accountName={activeAccount?.name}
      accountType={getActiveAccountType(activeAccount)}
      accountsHydrated={accountsHydrated}
      isBootstrapSeeded={bootstrapPhase === "seeded"}
    />
  );
}
