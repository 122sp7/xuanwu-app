"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const params = useParams<{ accountId: string }>();
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";
  const isLegacyWorkspaceAlias = routeAccountId === "workspace";
  const searchParams = useSearchParams();

  const {
    state: { activeAccount, accounts, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();

  const resolvedAccountId =
    (isLegacyWorkspaceAlias ? activeAccount?.id : routeAccountId) || activeAccount?.id || "";
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

  useEffect(() => {
    if (!isLegacyWorkspaceAlias || !activeAccount?.id) {
      return;
    }

    const query = searchParams.toString();
    const targetPath = `/${encodeURIComponent(activeAccount.id)}`;
    router.replace(query.length > 0 ? `${targetPath}?${query}` : targetPath);
  }, [activeAccount?.id, isLegacyWorkspaceAlias, router, searchParams]);

  if (isLegacyWorkspaceAlias && activeAccount?.id) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        正在導向帳號工作區路由…
      </div>
    );
  }

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
