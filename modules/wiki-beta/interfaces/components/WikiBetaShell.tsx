"use client";

/**
 * WikiBetaShell — wiki + notion style layout shell for the Wiki Beta module.
 *
 * Provides a consistent two-column layout with:
 *  - Left: collapsible page/library tree sidebar
 *  - Right: content area with breadcrumb and page title
 *
 * Follows the UI-UX spec from docs/wiki-beta/wiki-beta-ui-ux-spec.md.
 * Component state: purely presentational, no business logic.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

import { cn } from "@ui-shadcn/utils";
import { Button } from "@ui-shadcn/ui/button";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";
import { Separator } from "@ui-shadcn/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

/* ------------------------------------------------------------------ */
/*  Navigation items                                                  */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  {
    href: "/wiki-beta",
    label: "知識總覽",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/wiki-beta/pages",
    label: "Pages",
    icon: FileText,
  },
  {
    href: "/wiki-beta/libraries",
    label: "Libraries",
    icon: Database,
  },
  {
    href: "/wiki-beta/documents",
    label: "Documents",
    icon: BookOpen,
  },
  {
    href: "/wiki-beta/rag-query",
    label: "RAG Query",
    icon: MessageSquare,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface WikiBetaShellProps {
  /** Page content */
  readonly children: ReactNode;
  /** Optional sidebar content (e.g. page tree, library list) */
  readonly sidebar?: ReactNode;
  /** Optional header actions (e.g. search, create button) */
  readonly headerActions?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function WikiBetaShell({
  children,
  sidebar,
  headerActions,
}: WikiBetaShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = useCallback(
    (href: string, exact?: boolean) => {
      if (exact) return pathname === href;
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full min-h-0 overflow-hidden rounded-xl border border-border/60 bg-background">
        {/* ── Left sidebar ── */}
        <aside
          className={cn(
            "flex flex-col border-r border-border/60 bg-muted/30 transition-all duration-200",
            sidebarCollapsed ? "w-12" : "w-56",
          )}
        >
          {/* Sidebar header */}
          <div className="flex h-12 items-center justify-between border-b border-border/60 px-3">
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Wiki Beta
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? "展開側邊欄" : "收起側邊欄"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="space-y-0.5 p-2" aria-label="Wiki Beta navigation">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, "exact" in item ? item.exact : undefined);
                const Icon = item.icon;

                const link = (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      sidebarCollapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return link;
              })}
            </nav>

            {/* Extended sidebar content (e.g. page tree) */}
            {!sidebarCollapsed && sidebar && (
              <>
                <Separator className="mx-2" />
                <div className="p-2">{sidebar}</div>
              </>
            )}
          </ScrollArea>
        </aside>

        {/* ── Main content area ── */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header bar */}
          {headerActions && (
            <div className="flex h-12 items-center gap-2 border-b border-border/60 px-4">
              {headerActions}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
