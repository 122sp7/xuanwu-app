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

import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/api";
import {
  type WorkspaceEntity,
} from "@/modules/workspace/interfaces/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

export type NavSection =
  | "workspace"
  | "knowledge"
  | "knowledge-base"
  | "knowledge-database"
  | "source"
  | "notebook"
  | "ai-chat"
  | "account"
  | "organization"
  | "other";

// ── Static nav constants ──────────────────────────────────────────────────────

export const ORGANIZATION_MANAGEMENT_ITEMS: readonly { id: string; label: string; href: string }[] = [];

export const ACCOUNT_NAV_ITEMS = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "dispatcher", label: "調度台", href: "/organization/schedule/dispatcher" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
] as const;

export const ACCOUNT_SECTION_MATCHERS = [
  "/organization/daily",
  "/organization/schedule",
  "/organization/audit",
] as const;

export const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: "工作區", icon: <Building2 className="size-3" /> },
  knowledge: { label: "Knowledge", icon: <BookOpen className="size-3" /> },
  "knowledge-base": { label: "Knowledge Base", icon: <BookOpen className="size-3" /> },
  "knowledge-database": { label: "Knowledge Database", icon: <Database className="size-3" /> },
  source: { label: "Source", icon: <FileText className="size-3" /> },
  notebook: { label: "Notebook", icon: <Brain className="size-3" /> },
  "ai-chat": { label: "AI Chat", icon: <Bot className="size-3" /> },
  account: { label: "Account", icon: <UserRound className="size-3" /> },
  organization: { label: "組織", icon: <Users className="size-3" /> },
  other: { label: "導覽", icon: null },
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
  if (pathname.startsWith("/workspace")) return "workspace";
  if (pathname.startsWith("/knowledge-base")) return "knowledge-base";
  if (pathname.startsWith("/knowledge-database")) return "knowledge-database";
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/source")) return "source";
  if (pathname.startsWith("/notebook")) return "notebook";
  if (pathname.startsWith("/ai-chat")) return "ai-chat";
  if (ACCOUNT_SECTION_MATCHERS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)))
    return "account";
  if (pathname.startsWith("/organization")) return "organization";
  return "other";
}

export function isActiveOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

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
    <nav className="space-y-0.5" aria-label={`${title} navigation`}>
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
