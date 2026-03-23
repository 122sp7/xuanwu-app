"use client";

/**
 * Dashboard page — /dashboard
 * Entry point for the authenticated shell. Shows the active account context.
 */

import Link from "next/link";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";

export default function DashboardPage() {
  const { state: authState } = useAuth();
  const { state: appState } = useApp();
  const { user } = authState;
  const { activeAccount, accounts } = appState;

  const orgCount = Object.keys(accounts).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          歡迎回來，{user?.name ?? "成員"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          目前帳號情境：{" "}
          <span className="font-medium text-foreground">
            {activeAccount?.name ?? "—"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            組織數
          </p>
          <p className="mt-2 text-3xl font-bold">{orgCount}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            帳號
          </p>
          <p className="mt-2 text-base font-semibold">{user?.email ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            快速連結
          </p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link href="/workspace" className="text-primary hover:underline">
              工作區中心
            </Link>
            <Link href="/settings" className="text-primary hover:underline">
              帳號設定
            </Link>
            <Link href="/organization" className="text-primary hover:underline">
              組織管理
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold">快速入口</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          直接進入已登入的工作區介面與帳號管理區域。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/workspace"
            className="rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            開啟工作區中心
          </Link>
          <Link
            href="/organization"
            className="rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            開啟組織管理
          </Link>
          <Link
            href="/settings"
            className="rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            開啟帳號設定
          </Link>
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            目前帳號：{activeAccount?.name ?? "—"}
          </div>
        </div>
      </section>
    </div>
  );
}
