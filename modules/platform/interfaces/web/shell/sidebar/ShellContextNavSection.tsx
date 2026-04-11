"use client";

import Link from "next/link";
import { appendWorkspaceContextQuery } from "@/modules/workspace/api";

interface ContextScopedNavItem {
  href: string;
  label: string;
}

interface ShellContextNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}

export function ShellContextNavSection({
  title,
  items,
  isActiveRoute,
  activeAccountId,
  activeWorkspaceId,
}: ShellContextNavSectionProps) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `帳號: ${activeAccountId.slice(0, 8)}` : "帳號: -"}
          {" · "}
          {activeWorkspaceId ? `工作區: ${activeWorkspaceId.slice(0, 8)}` : "工作區: -"}
        </p>
      )}
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        const contextualHref = appendWorkspaceContextQuery(item.href, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
