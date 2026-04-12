"use client";

import { useParams, useSearchParams } from "next/navigation";

import type { ActiveAccount } from "@/modules/platform/api";
import {
  isActiveOrganizationAccount,
  useApp,
  useAuth,
} from "@/modules/platform/api";
import { WorkspaceHubScreen } from "@/modules/workspace/api";

function getAccountTypeFromRoute(accountId: string, authUserId: string | null): "user" | "organization" {
  if (!accountId) {
    return "user";
  }
  return authUserId && accountId === authUserId ? "user" : "organization";
}

function getFallbackAccountType(activeAccount: ActiveAccount | null): "user" | "organization" {
  return isActiveOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function AccountWorkspaceHubPage() {
  const params = useParams<{ accountId: string }>();
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";
  const searchParams = useSearchParams();

  const {
    state: { activeAccount, accounts, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();

  const resolvedAccountId = routeAccountId || activeAccount?.id || "";
  const authUserId = authState.user?.id ?? null;
  const authUserName = authState.user?.name ?? null;
  const organizationAccount = Object.values(accounts).find(
    (account) => account.id === resolvedAccountId,
  );

  const accountName =
    resolvedAccountId === authUserId
      ? authUserName
      : organizationAccount?.name ??
        (resolvedAccountId === activeAccount?.id ? activeAccount?.name : null);

  const accountType = resolvedAccountId
    ? getAccountTypeFromRoute(resolvedAccountId, authUserId)
    : getFallbackAccountType(activeAccount);

  const context = searchParams.get("context");

  return (
    <div className="space-y-4">
      {context === "unavailable" && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          目前帳戶無法存取該工作區，已返回工作區清單。
        </div>
      )}

      <WorkspaceHubScreen
        accountId={resolvedAccountId || null}
        accountName={accountName}
        accountType={accountType}
        accountsHydrated={accountsHydrated}
        isBootstrapSeeded={bootstrapPhase === "seeded"}
        currentUserId={authUserId}
      />
    </div>
  );
}
