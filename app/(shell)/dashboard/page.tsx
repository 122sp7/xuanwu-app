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
          Welcome back, {user?.name ?? "Member"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Active context:{" "}
          <span className="font-medium text-foreground">
            {activeAccount?.name ?? "—"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Organizations
          </p>
          <p className="mt-2 text-3xl font-bold">{orgCount}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          <p className="mt-2 text-base font-semibold">{user?.email ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Links
          </p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link href="/settings" className="text-primary hover:underline">
              Account Settings
            </Link>
            <Link href="/organization" className="text-primary hover:underline">
              Organizations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
