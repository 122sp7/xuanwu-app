"use client";

import { CalendarDays, Orbit, Workflow } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;

  const activeOrganizationId = isOrganizationAccount(activeAccount)
    ? activeAccount.id
    : null;

  if (!activeOrganizationId) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Account schedule
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          組織排程重建中
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          舊的 schedule 模組已移除。這個入口暫時保留為組織層排程頁，避免 shell 導覽與 URL 失效，同時清除對舊領域的直接依賴。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold text-foreground">目前狀態</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            route 已保留，但跨工作區預約彙整與週曆視圖已從此頁面卸載。
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
          <Workflow className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold text-foreground">後續重建重點</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            先定義最小 request 與 dispatch read model，再逐步恢復 organization schedule 的聚合檢視。
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
          <Orbit className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold text-foreground">邊界</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            這裡只保留 account 層入口，不再引用舊的查詢、投影或排程元件。
          </p>
        </div>
      </div>
    </section>
  );
}
