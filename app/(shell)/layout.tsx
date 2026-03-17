"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/app/providers/auth-provider";
import { ShellGuard } from "./_components/shell-guard";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/organization", label: "Organizations" },
  { href: "/settings", label: "Settings" },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state: authState, logout } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);

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
          <div className="mb-6">
            <p className="text-sm font-semibold tracking-tight">Xuanwu App</p>
            <p className="text-xs text-muted-foreground">Authenticated Workspace</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
          <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="md:hidden">
              <p className="text-sm font-semibold">Xuanwu App</p>
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
