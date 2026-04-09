"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Section pages live under /organization/[section].
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

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
    router.replace("/workspace");
  }

  function handleSwitchToPersonal() {
    if (!user) return;
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
    router.replace("/workspace");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Context Switcher</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          先選擇個人或組織帳號情境，再回到 workspace-first 主流程。
        </p>
      </div>

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold">Recommended flow</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1. Identity</span>：登入後確認你目前要操作的個人／組織帳號。
          </li>
          <li>
            <span className="font-medium text-foreground">2. Organization</span>：在這裡切換 active account。
          </li>
          <li>
            <span className="font-medium text-foreground">3. Workspace</span>：回到工作區，再進入 Knowledge、知識頁面、Notebook / AI。
          </li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/workspace">回到 Workspace Hub</Link>
          </Button>
          {activeOrganizationId && (
            <Button asChild size="sm" variant="outline">
              <Link href="/organization/members">組織治理模組</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Quick-access dashboard — visible only when an org context is active */}
      {activeOrganizationId && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">組織功能</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { href: "/organization/members", title: "成員管理", desc: "邀請與管理組織成員" },
              { href: "/organization/teams", title: "團隊管理", desc: "建立與編輯團隊" },
              { href: "/organization/permissions", title: "權限政策", desc: "設定存取規則" },
              { href: "/organization/workspaces", title: "工作區", desc: "組織下的工作區清單" },
              { href: "/organization/schedule", title: "工作需求排程", desc: "排程與容量總覽" },
              { href: "/organization/audit", title: "稽核記錄", desc: "操作歷史追蹤" },
              { href: "/organization/daily", title: "動態牆", desc: "組織工作區動態" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                    <CardDescription className="text-xs">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

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
          已切換組織情境；下一步建議先回到 Workspace Hub，再從工作區進入知識與協作模組。
        </p>
      )}
    </div>
  );
}
