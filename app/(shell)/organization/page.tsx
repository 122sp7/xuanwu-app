"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Section pages live under /organization/[section].
 */

import { useRouter } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { Button } from "@/ui/shadcn/ui/button";

function isOrganizationAccount(
  activeAccount: ReturnType<typeof useApp>["state"]["activeAccount"],
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

export default function OrganizationPage() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { user } = authState;
  const { accounts, activeAccount, accountsHydrated, bootstrapPhase } = appState;

  const orgList = Object.values(accounts);
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  function handleSwitch(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    router.replace("/organization/members");
  }

  function handleSwitchToPersonal() {
    if (user) dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organization Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between your personal account and your organizations.
        </p>
      </div>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          {bootstrapPhase === "seeded"
            ? "正在同步你的組織清單，完成後就能切換到對應的組織上下文。"
            : "正在載入組織資料…"}
        </div>
      )}

      {/* Personal account */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Personal Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {activeAccount?.id === user?.id ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Active
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwitchToPersonal}
            >
              Switch
            </Button>
          )}
        </div>
      </section>

      {/* Organizations */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">
          Organizations
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({orgList.length})
          </span>
        </h2>

        {orgList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You are not a member of any organization yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {orgList.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  {org.description && (
                    <p className="text-xs text-muted-foreground">{org.description}</p>
                  )}
                </div>
                {activeAccount?.id === org.id ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Active
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSwitch(org)}
                  >
                    Switch
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeOrganizationId && (
        <p className="text-sm text-muted-foreground">
          選擇左側側邊欄的項目以管理組織設定。
        </p>
      )}
    </div>
  );
}
