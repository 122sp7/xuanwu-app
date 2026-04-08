import type { WorkspaceEntity } from "../domain/entities/Workspace";

const LAST_ACTIVE_WORKSPACE_STORAGE_PREFIX = "xuanwu_last_active_workspace:";

export function getWorkspaceStorageKey(accountId: string): string {
  return `${LAST_ACTIVE_WORKSPACE_STORAGE_PREFIX}${accountId}`;
}

export function toWorkspaceMap(workspaces: WorkspaceEntity[]): Record<string, WorkspaceEntity> {
  return Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace]));
}
