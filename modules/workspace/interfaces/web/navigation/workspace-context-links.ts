export interface WorkspaceNavigationContext {
  readonly accountId: string | null;
  readonly workspaceId: string | null;
}

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "workspace-feed",
  "knowledge",
  "knowledge-base",
  "knowledge-database",
  "source",
  "notebook",
  "ai-chat",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

export const WORKSPACE_OVERVIEW_PANELS = [
  "knowledge-pages",
  "knowledge-base-articles",
  "knowledge-databases",
  "source-libraries",
  "settings",
] as const;

export type WorkspaceOverviewPanel = (typeof WORKSPACE_OVERVIEW_PANELS)[number];

function normalizeWorkspaceToolPath(pathname: string): string {
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

  if (["organization", "settings", "dev-tools"].includes(secondSegment)) {
    return `/${[secondSegment, ...restSegments].join("/")}`;
  }

  if (restSegments.length === 0) {
    return "/workspace";
  }

  return `/${restSegments.join("/")}`;
}

function tryGetAccountIdFromPath(pathname: string): string | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (!firstSegment) {
    return null;
  }
  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return null;
  }
  return decodeURIComponent(firstSegment);
}

function buildWorkspaceBaseHref(workspaceId: string, accountId?: string | null): string {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  if (accountId) {
    return `/${encodeURIComponent(accountId)}/${encodedWorkspaceId}`;
  }
  return `/workspace/${encodedWorkspaceId}`;
}

export function buildWorkspaceOverviewPanelHref(
  workspaceId: string,
  panel?: WorkspaceOverviewPanel,
  accountId?: string | null,
): string {
  const baseHref = buildWorkspaceBaseHref(workspaceId, accountId);
  if (!panel) {
    return `${baseHref}?tab=Overview`;
  }
  return `${baseHref}?tab=Overview&panel=${encodeURIComponent(panel)}`;
}

export function supportsWorkspaceSearchContext(pathname: string): boolean {
  const normalizedPathname = normalizeWorkspaceToolPath(pathname);
  return (
    normalizedPathname.startsWith("/knowledge") ||
    normalizedPathname.startsWith("/knowledge-base") ||
    normalizedPathname.startsWith("/knowledge-database") ||
    normalizedPathname.startsWith("/source") ||
    normalizedPathname.startsWith("/notebook")
  );
}

export function buildWorkspaceContextHref(pathname: string, workspaceId: string): string {
  const accountId = tryGetAccountIdFromPath(pathname);
  const normalizedPathname = normalizeWorkspaceToolPath(pathname);

  if (normalizedPathname.startsWith("/knowledge-base")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-base-articles", accountId);
  }

  if (normalizedPathname.startsWith("/knowledge-database")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-databases", accountId);
  }

  if (normalizedPathname.startsWith("/knowledge")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-pages", accountId);
  }

  if (normalizedPathname.startsWith("/source/libraries")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "source-libraries", accountId);
  }

  if (normalizedPathname.startsWith("/source/documents")) {
    return `${buildWorkspaceBaseHref(workspaceId, accountId)}?tab=Files`;
  }

  return buildWorkspaceBaseHref(workspaceId, accountId);
}

export function appendWorkspaceContextQuery(
  href: string,
  context: WorkspaceNavigationContext,
): string {
  const { accountId, workspaceId } = context;

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