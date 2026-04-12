"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { ActiveAccount } from "@/modules/platform/api";
import { useApp, useAuth, isActiveOrganizationAccount } from "@/modules/platform/api"
import { WorkspaceHubScreen } from "@/modules/workspace/api";

function getActiveAccountType(activeAccount: ActiveAccount | null) {
  return isActiveOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function WorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeAccount, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();
  const context = searchParams.get("context");

  useEffect(() => {
    const activeAccountId = activeAccount?.id;
    if (!activeAccountId) {
      return;
    }

    const query = searchParams.toString();
    const targetPath = `/${encodeURIComponent(activeAccountId)}`;
    router.replace(query.length > 0 ? `${targetPath}?${query}` : targetPath);
  }, [activeAccount?.id, router, searchParams]);

  if (activeAccount?.id) {
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
        accountId={activeAccount?.id}
        accountName={activeAccount?.name}
        accountType={getActiveAccountType(activeAccount)}
        accountsHydrated={accountsHydrated}
        isBootstrapSeeded={bootstrapPhase === "seeded"}
        currentUserId={authState.user?.id}
      />
    </div>
  );
}
