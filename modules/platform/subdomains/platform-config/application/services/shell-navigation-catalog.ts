// ── Types ──────────────────────────────────────────────────────────────────────

export type ShellNavSection =
  | "workspace"
  | "dashboard"
  | "account"
  | "organization"
  | "other";

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface ShellRailCatalogItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  /** If true, this item is only visible to organization accounts. */
  readonly requiresOrganization: boolean;
  /** Route prefix for active-state matching. When absent, defaults to href. */
  readonly activeRoutePrefix?: string;
}

export interface ShellContextSectionConfig {
  readonly title: string;
  readonly items: readonly { href: string; label: string }[];
}

export interface ShellRouteContext {
  readonly accountId?: string | null;
  readonly workspaceId?: string | null;
}

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

const ACCOUNT_SCOPED_ACCOUNT_ROOT_ROUTES = new Set(["organization", "settings", "dashboard", "dev-tools"]);

const ACCOUNT_SCOPED_WORKSPACE_TOOL_ROOT_ROUTES = new Set<string>([]);

function parseHref(href: string): { path: string; query: string } {
  const [path, query = ""] = href.split("?");
  return { path, query };
}

function joinHref(path: string, query: string): string {
  return query.length > 0 ? `${path}?${query}` : path;
}

function isAccountScopedWorkspacePath(pathname: string): boolean {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (!firstSegment) {
    return false;
  }
  return !NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment);
}

export function normalizeShellRoutePath(pathname: string): string {
  const [pathOnly] = pathname.split("?");
  const segments = pathOnly.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  const [firstSegment, secondSegment, ...restSegments] = segments;

  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return pathOnly;
  }

  if (!secondSegment) {
    return "/workspace";
  }

  if (ACCOUNT_SCOPED_ACCOUNT_ROOT_ROUTES.has(secondSegment)) {
    return `/${[secondSegment, ...restSegments].join("/")}`;
  }

  if (restSegments.length === 0) {
    return "/workspace";
  }

  return `/${restSegments.join("/")}`;
}

export function buildShellContextualHref(
  href: string,
  context: ShellRouteContext,
): string {
  const { accountId, workspaceId } = context;
  if (!accountId) {
    return href;
  }

  const { path, query } = parseHref(href);
  const encodedAccountId = encodeURIComponent(accountId);
  const encodedWorkspaceId = workspaceId ? encodeURIComponent(workspaceId) : "";

  if (path === "/workspace" || path.startsWith("/workspace/")) {
    const nextPath = encodedWorkspaceId
      ? `/${encodedAccountId}/${encodedWorkspaceId}`
      : `/${encodedAccountId}`;
    return joinHref(nextPath, query);
  }

  const [rootSegment] = path.split("/").filter(Boolean);
  if (!rootSegment) {
    return href;
  }

  if (ACCOUNT_SCOPED_ACCOUNT_ROOT_ROUTES.has(rootSegment)) {
    return joinHref(`/${encodedAccountId}${path}`, query);
  }

  if (ACCOUNT_SCOPED_WORKSPACE_TOOL_ROOT_ROUTES.has(rootSegment)) {
    if (!encodedWorkspaceId) {
      return joinHref(`/${encodedAccountId}`, query);
    }
    return joinHref(`/${encodedAccountId}/${encodedWorkspaceId}${path}`, query);
  }

  return href;
}

// ── Route-matching utility ────────────────────────────────────────────────────

export function isExactOrChildPath(targetPath: string, pathname: string): boolean {
  const normalizedTargetPath = normalizeShellRoutePath(targetPath);
  const normalizedPathname = normalizeShellRoutePath(pathname);
  return (
    normalizedPathname === normalizedTargetPath ||
    normalizedPathname.startsWith(`${normalizedTargetPath}/`)
  );
}

// ── Account section matchers ──────────────────────────────────────────────────

export const SHELL_ACCOUNT_SECTION_MATCHERS = [
  "/organization/daily",
  "/organization/schedule",
  "/organization/audit",
] as const;

// ── Route titles & breadcrumb labels ──────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/organization": "組織治理",
  "/organization/daily": "帳號 · 每日",
  "/organization/schedule": "帳號 · 排程",
  "/organization/schedule/dispatcher": "帳號 · 調度台",
  "/organization/audit": "帳號 · 稽核",
  "/workspace": "工作區中心",
  "/dashboard": "儀表板",
  "/dev-tools": "開發工具",
};

const BREADCRUMB_LABELS: Record<string, string> = {
  organization: "組織",
  workspace: "工作區",
  dashboard: "儀表板",
  "dev-tools": "開發工具",
  namespaces: "命名空間",
  members: "成員",
  teams: "團隊",
  permissions: "權限",
  workspaces: "工作區清單",
  schedule: "排程",
  daily: "每日",
  audit: "稽核",
};

// ── Organization management items ─────────────────────────────────────────────

export const SHELL_ORGANIZATION_MANAGEMENT_ITEMS: readonly ShellNavItem[] = [];

// ── Account nav items ─────────────────────────────────────────────────────────

export const SHELL_ACCOUNT_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "dispatcher", label: "調度台", href: "/organization/schedule/dispatcher" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
] as const;

// ── Section labels ────────────────────────────────────────────────────────────

export const SHELL_SECTION_LABELS: Record<ShellNavSection, string> = {
  workspace: "工作區",
  dashboard: "儀表板",
  account: "帳號",
  organization: "組織",
  other: "導覽",
};

// ── Rail catalog ──────────────────────────────────────────────────────────────

export const SHELL_RAIL_CATALOG_ITEMS: readonly ShellRailCatalogItem[] = [
  { id: "workspace", href: "/workspace", label: "工作區中心", requiresOrganization: false },
  { id: "dashboard", href: "/dashboard", label: "儀表板", requiresOrganization: false, activeRoutePrefix: "/dashboard" },
  { id: "org-members", href: "/organization/members", label: "成員", requiresOrganization: true, activeRoutePrefix: "/organization/members" },
  { id: "org-teams", href: "/organization/teams", label: "團隊", requiresOrganization: true, activeRoutePrefix: "/organization/teams" },
  { id: "org-daily", href: "/organization/daily", label: "每日", requiresOrganization: true, activeRoutePrefix: "/organization/daily" },
  { id: "org-schedule", href: "/organization/schedule", label: "排程", requiresOrganization: true, activeRoutePrefix: "/organization/schedule" },
  { id: "org-audit", href: "/organization/audit", label: "稽核", requiresOrganization: true, activeRoutePrefix: "/organization/audit" },
  { id: "org-permissions", href: "/organization/permissions", label: "權限", requiresOrganization: true, activeRoutePrefix: "/organization/permissions" },
  { id: "dev-tools", href: "/dev-tools", label: "開發工具", requiresOrganization: false },
];

export function listShellRailCatalogItems(isOrganization: boolean): readonly ShellRailCatalogItem[] {
  return SHELL_RAIL_CATALOG_ITEMS.filter(
    (item) => !item.requiresOrganization || isOrganization,
  );
}

// ── Context section config ────────────────────────────────────────────────────

export const SHELL_CONTEXT_SECTION_CONFIG: Partial<
  Record<ShellNavSection, ShellContextSectionConfig>
> = {};

// ── Mobile & organization nav items ───────────────────────────────────────────

export const SHELL_MOBILE_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "workspace", label: "工作區", href: "/workspace" },
];

export const SHELL_ORG_PRIMARY_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "members", label: "成員", href: "/organization/members" },
  { id: "teams", label: "團隊", href: "/organization/teams" },
  { id: "permissions", label: "權限", href: "/organization/permissions" },
  { id: "workspaces", label: "工作區", href: "/organization/workspaces" },
];

export const SHELL_ORG_SECONDARY_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
];

// ── Section resolvers ─────────────────────────────────────────────────────────

export function resolveShellNavSection(pathname: string): ShellNavSection {
  const normalizedPathname = normalizeShellRoutePath(pathname);

  if (normalizedPathname.startsWith("/workspace")) return "workspace";
  if (normalizedPathname.startsWith("/dashboard")) return "dashboard";
  if (
    SHELL_ACCOUNT_SECTION_MATCHERS.some(
      (prefix) => normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`),
    )
  ) {
    return "account";
  }
  if (normalizedPathname.startsWith("/organization")) return "organization";
  if (isAccountScopedWorkspacePath(pathname) || normalizedPathname.startsWith("/workspace")) return "workspace";
  return "other";
}

export function resolveShellPageTitle(pathname: string): string {
  if (isAccountScopedWorkspacePath(pathname)) {
    return "工作區中心";
  }
  const normalizedPathname = normalizeShellRoutePath(pathname);
  return ROUTE_TITLES[normalizedPathname] ?? "工作區";
}

export function resolveShellBreadcrumbLabel(segment: string): string {
  return BREADCRUMB_LABELS[segment] ?? segment;
}
