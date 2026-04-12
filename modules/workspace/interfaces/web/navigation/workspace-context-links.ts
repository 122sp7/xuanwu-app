export interface WorkspaceNavigationContext {
  readonly accountId: string | null;
  readonly workspaceId: string | null;
}

export const WORKSPACE_OVERVIEW_PANELS = [
  "knowledge-pages",
  "knowledge-base-articles",
  "knowledge-databases",
  "source-libraries",
  "settings",
] as const;

export type WorkspaceOverviewPanel = (typeof WORKSPACE_OVERVIEW_PANELS)[number];

export function buildWorkspaceOverviewPanelHref(
  workspaceId: string,
  panel?: WorkspaceOverviewPanel,
): string {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  if (!panel) {
    return `/workspace/${encodedWorkspaceId}?tab=Overview`;
  }
  return `/workspace/${encodedWorkspaceId}?tab=Overview&panel=${encodeURIComponent(panel)}`;
}

export function supportsWorkspaceSearchContext(pathname: string): boolean {
  return (
    pathname.startsWith("/knowledge") ||
    pathname.startsWith("/knowledge-base") ||
    pathname.startsWith("/knowledge-database") ||
    pathname.startsWith("/source") ||
    pathname.startsWith("/notebook")
  );
}

export function buildWorkspaceContextHref(pathname: string, workspaceId: string): string {
  if (pathname.startsWith("/knowledge-base")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-base-articles");
  }

  if (pathname.startsWith("/knowledge-database")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-databases");
  }

  if (pathname.startsWith("/knowledge")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "knowledge-pages");
  }

  if (pathname.startsWith("/source/libraries")) {
    return buildWorkspaceOverviewPanelHref(workspaceId, "source-libraries");
  }

  if (pathname.startsWith("/source/documents")) {
    return `/workspace/${encodeURIComponent(workspaceId)}?tab=Files`;
  }

  return `/workspace/${workspaceId}`;
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