"use client";

import { useAccountRouteContext } from "@/modules/platform/api/ui";

import { AccountSchedulingView } from "../AccountSchedulingView";

export function OrganizationScheduleRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Account Scheduling
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          工作需求總覽
        </h1>
      </header>

      <AccountSchedulingView
        accountId={organizationId}
        currentUserId={organizationId}
      />
    </section>
  );
}