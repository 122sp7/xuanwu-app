"use client";

import { useApp } from "@/app/providers/app-provider";
import { DailyFeed } from "@/modules/daily";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationDailyPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  if (!activeOrganizationId) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <DailyFeed scope={{ accountId: activeOrganizationId }} />
    </div>
  );
}

