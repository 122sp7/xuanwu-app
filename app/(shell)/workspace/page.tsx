"use client";

import { useSearchParams } from "next/navigation";

import type { ActiveAccount } from "@/app/providers/app-context";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { isActiveOrganizationAccount } from "@/modules/platform/api";
import { WorkspaceHubScreen } from "@/modules/workspace/api";

function getActiveAccountType(activeAccount: ActiveAccount | null) {
  return isActiveOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const {
    state: { activeAccount, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();
  const context = searchParams.get("context");

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
