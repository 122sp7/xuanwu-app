"use client";

import { Layers3, Orbit } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
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
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-border/60 bg-card/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Account Daily</p>
            <p className="mt-1 text-sm text-muted-foreground">
              聚合名下 workspace 的 Daily feed。現階段先保留入口與 account scope，避免已刪除模組持續卡住後續實作。
            </p>
          </div>
          <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
            rebuilding
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-border bg-background/70 p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Layers3 className="h-4 w-4" />
            account scope preserved
          </div>
          <p className="mt-2 text-sm text-muted-foreground">organization/account id: {activeOrganizationId}</p>
        </article>

        <article className="rounded-2xl border border-dashed border-border bg-background/70 p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Orbit className="h-4 w-4" />
            next build target
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            之後在這裡接回跨 workspace 的 X-like timeline，並補上 reply、repost、like、view、bookmark、share。
          </p>
        </article>
      </div>
    </section>
  );
}

