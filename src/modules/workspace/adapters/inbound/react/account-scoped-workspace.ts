import type { WorkspaceEntity } from "./WorkspaceContext";

interface ResolveAccountScopedWorkspaceIdInput {
  readonly accountId: string | null;
  readonly activeWorkspaceId: string | null;
  readonly workspaces: Record<string, WorkspaceEntity>;
}

export function resolveAccountScopedWorkspaceId({
  accountId,
  activeWorkspaceId,
  workspaces,
}: ResolveAccountScopedWorkspaceIdInput): string | null {
  if (!accountId) return null;
  const accountWorkspaces = Object.values(workspaces).filter(
    (workspace) => workspace.accountId === accountId,
  );
  if (accountWorkspaces.length === 0) return null;
  if (
    activeWorkspaceId &&
    accountWorkspaces.some((workspace) => workspace.id === activeWorkspaceId)
  ) {
    return activeWorkspaceId;
  }
  accountWorkspaces.sort((a, b) => a.name.localeCompare(b.name));
  return accountWorkspaces[0]?.id ?? null;
}
