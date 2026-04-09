/**
 * Workspace Read Queries — thin wrappers exposing read operations through the input port.
 */

import type { WorkspaceEntity } from "./contracts";
import { workspaceQueryPort } from "./workspace-runtime";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return workspaceQueryPort.getWorkspacesForAccount(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return workspaceQueryPort.subscribeToWorkspacesForAccount(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return workspaceQueryPort.getWorkspaceById(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return workspaceQueryPort.getWorkspaceByIdForAccount(accountId, workspaceId);
}
