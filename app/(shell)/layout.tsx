"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { ShellGuard } from "./_components/shell-guard";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/organization", label: "Organizations" },
  { href: "/settings", label: "Settings" },
];

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/organization": "Organizations",
  "/settings": "Account Settings",
};

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state: authState, logout } = useAuth();
  const { state: appState } = useApp();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const pageTitle = routeTitles[pathname] ?? "Workspace";
  const orgCount = Object.keys(appState.accounts).length;

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("Sign out failed. Please retry.");
    }
  }

  return (
    <ShellGuard>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-64 border-r border-border/50 bg-card/30 p-5 md:block">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-semibold tracking-tight">Xuanwu App</p>
            <p className="text-xs text-muted-foreground">Authenticated Workspace</p>
            <p className="pt-1 text-xs text-muted-foreground">{orgCount} Organizations</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-tight">{pageTitle}</p>
                <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                  Active: {appState.activeAccount?.name ?? authState.user?.name ?? "—"}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="max-w-[220px] truncate text-sm font-medium">{authState.user?.email ?? "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-border/60 px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <nav className="flex gap-2 overflow-auto pb-3 md:hidden">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "border border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {logoutError && (
            <div className="px-4 pt-3 text-xs text-destructive md:px-6">{logoutError}</div>
          )}

          <main className="flex-1 overflow-auto p-6">{children}</main>

          <footer className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground md:px-6">
            Xuanwu App Workspace
          </footer>
        </div>
      </div>
    </ShellGuard>
  );
}
