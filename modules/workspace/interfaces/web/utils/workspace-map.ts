import type { WorkspaceEntity } from "../../contracts";

export function toWorkspaceMap(workspaces: WorkspaceEntity[]): Record<string, WorkspaceEntity> {
  return Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace]));
}

export function resolveWorkspaceFromMap(
  workspaces: Record<string, WorkspaceEntity>,
  id: string,
): WorkspaceEntity | null {
  if (!id || !Object.hasOwn(workspaces, id)) return null;
  return workspaces[id] ?? null;
}