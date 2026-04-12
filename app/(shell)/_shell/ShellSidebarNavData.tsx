import {
  BookOpen,
  Bot,
  Brain,
  Building2,
  Database,
  FileText,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

import type { ActiveAccount } from "@/modules/platform/api";
import {
  isOrganizationActor,
  isActiveOrganizationAccount,
} from "@/modules/platform/subdomains/access-control/api";
import {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  isExactOrChildPath,
  resolveShellNavSection,
  type ShellNavSection,
} from "@/modules/platform/subdomains/platform-config/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly userId: string | null;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

export type NavSection = ShellNavSection;

// ── Static nav constants ──────────────────────────────────────────────────────

export const ORGANIZATION_MANAGEMENT_ITEMS = SHELL_ORGANIZATION_MANAGEMENT_ITEMS;

export const ACCOUNT_NAV_ITEMS = SHELL_ACCOUNT_NAV_ITEMS;

export const ACCOUNT_SECTION_MATCHERS = SHELL_ACCOUNT_SECTION_MATCHERS;

export const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: SHELL_SECTION_LABELS.workspace, icon: <Building2 className="size-3" /> },
  knowledge: { label: SHELL_SECTION_LABELS.knowledge, icon: <BookOpen className="size-3" /> },
  "knowledge-base": { label: SHELL_SECTION_LABELS["knowledge-base"], icon: <BookOpen className="size-3" /> },
  "knowledge-database": {
    label: SHELL_SECTION_LABELS["knowledge-database"],
    icon: <Database className="size-3" />,
  },
  source: { label: SHELL_SECTION_LABELS.source, icon: <FileText className="size-3" /> },
  notebook: { label: SHELL_SECTION_LABELS.notebook, icon: <Brain className="size-3" /> },
  "ai-chat": { label: SHELL_SECTION_LABELS["ai-chat"], icon: <Bot className="size-3" /> },
  account: { label: SHELL_SECTION_LABELS.account, icon: <UserRound className="size-3" /> },
  organization: { label: SHELL_SECTION_LABELS.organization, icon: <Users className="size-3" /> },
  other: { label: SHELL_SECTION_LABELS.other, icon: null },
};

// ── CSS class helpers ─────────────────────────────────────────────────────────

export function sidebarItemClass(active: boolean) {
  return `group flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
  }`;
}

export const sidebarSectionTitleClass =
  "mb-1.5 px-2 text-[11px] font-semibold tracking-tight text-muted-foreground/85";

export const sidebarGroupButtonClass =
  "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border/60 hover:bg-muted/70 hover:text-foreground";

// ── Pure section helpers ──────────────────────────────────────────────────────

export function resolveNavSection(pathname: string): NavSection {
  return resolveShellNavSection(pathname);
}

export function isActiveRoute(pathname: string, href: string) {
  return isExactOrChildPath(href, pathname);
}

export { isActiveOrganizationAccount, isOrganizationActor };

// ── Simple section nav component ──────────────────────────────────────────────

export function SimpleNavLinks({
  items,
  title,
  isActiveRoute,
}: {
  items: readonly { href: string; label: string }[];
  title: string;
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
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
