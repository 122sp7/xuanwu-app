export interface WorkspaceNavigationContext {
  readonly accountId: string | null;
  readonly workspaceId: string | null;
}

export function supportsWorkspaceSearchContext(pathname: string): boolean {
  return (
    pathname.startsWith("/knowledge") ||
    pathname.startsWith("/source") ||
    pathname.startsWith("/notebook")
  );
}

export function buildWorkspaceContextHref(pathname: string, workspaceId: string): string {
  if (pathname.startsWith("/knowledge")) {
    const targetPath = pathname === "/knowledge" ? "/knowledge/pages" : pathname;
    return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
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