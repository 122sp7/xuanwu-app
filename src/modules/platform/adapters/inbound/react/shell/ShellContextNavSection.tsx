"use client";

/**
 * ShellContextNavSection — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace module.
 */

import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  ClipboardCheck,
  Inbox,
  ListTodo,
  Receipt,
} from "lucide-react";
import type { ReactNode } from "react";
import { appendWorkspaceContextQuery } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import { buildShellContextualHref } from "../../../../index";
import { sidebarItemClass, sidebarSectionTitleClass } from "./ShellSidebarNavData";

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

/** Resolve a lucide icon for context-section items by parsing ?tab= from the href. */
function getContextItemIcon(href: string): ReactNode | null {
  try {
    const tab = new URL(href, "http://x").searchParams.get("tab");
    const map: Record<string, ReactNode> = {
      TaskFormation: <Inbox className="size-3.5" />,
      Tasks:         <ListTodo className="size-3.5" />,
      Quality:       <ClipboardCheck className="size-3.5" />,
      Approval:      <BadgeCheck className="size-3.5" />,
      Settlement:    <Receipt className="size-3.5" />,
      Issues:        <AlertCircle className="size-3.5" />,
    };
    return tab ? (map[tab] ?? null) : null;
  } catch {
    return null;
  }
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
      <p className={sidebarSectionTitleClass}>{title}</p>
      {items.map((item) => {
        const scopedHref = buildShellContextualHref(item.href, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        const contextualHref = appendWorkspaceContextQuery(scopedHref, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        const active = isActiveRoute(contextualHref);
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={sidebarItemClass(active)}
          >
            {getContextItemIcon(item.href)}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
