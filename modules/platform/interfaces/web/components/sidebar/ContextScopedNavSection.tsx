"use client";

import Link from "next/link";

interface ContextScopedNavItem {
  href: string;
  label: string;
}

interface ContextScopedNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}

function withContextQuery(href: string, accountId: string | null, workspaceId: string | null): string {
  if (!accountId && !workspaceId) {
    return href;
  }

  const [path, search = ""] = href.split("?");
  const params = new URLSearchParams(search);

  if (accountId) {
    params.set("accountId", accountId);
  }

  if (workspaceId) {
    params.set("workspaceId", workspaceId);
  }

  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

export function ContextScopedNavSection({
  title,
  items,
  isActiveRoute,
  activeAccountId,
  activeWorkspaceId,
}: ContextScopedNavSectionProps) {
  return (
    <nav className="space-y-0.5" aria-label={`${title} navigation`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `Account: ${activeAccountId.slice(0, 8)}` : "Account: -"}
          {" · "}
          {activeWorkspaceId ? `Workspace: ${activeWorkspaceId.slice(0, 8)}` : "Workspace: -"}
        </p>
      )}
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        const contextualHref = withContextQuery(item.href, activeAccountId, activeWorkspaceId);
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
