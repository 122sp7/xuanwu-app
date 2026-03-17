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

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold">Quick Access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Workspace domain shortcuts are being completed. You can still access key areas below.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/organization"
            className="rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Open Organizations
          </Link>
          <Link
            href="/settings"
            className="rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Open Account Settings
          </Link>
          <div className="rounded-xl border border-dashed border-border/40 px-4 py-3 text-sm text-muted-foreground">
            Workspace Tools (Coming soon)
          </div>
        </div>
      </section>
    </div>
  );
}
