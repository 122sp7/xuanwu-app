"use client";

import { useAccountRouteContext } from "@/modules/platform/api";

import { WorkspaceFeedAccountView } from "../WorkspaceFeedAccountView";

export function OrganizationDailyRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-border/60 bg-card/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Account Workspace Feed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              聚合名下所有 workspace 的 feed，並提供 Reply / Repost / Like / View / Bookmark / Share 互動。
            </p>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            live
          </div>
        </div>
      </header>

      <WorkspaceFeedAccountView accountId={organizationId} actorAccountId={organizationId} />
    </section>
  );
}