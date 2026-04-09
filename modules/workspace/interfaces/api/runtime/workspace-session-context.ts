import type { WorkspaceCommandPort } from "../../../ports/input/WorkspaceCommandPort";
import type { WorkspaceQueryPort } from "../../../ports/input/WorkspaceQueryPort";

export interface WorkspaceSessionContext {
  readonly workspaceCommandPort: WorkspaceCommandPort;
  readonly workspaceQueryPort: WorkspaceQueryPort;
}

export function createWorkspaceSessionContext(
  workspaceCommandPort: WorkspaceCommandPort,
  workspaceQueryPort: WorkspaceQueryPort,
): WorkspaceSessionContext {
  return {
    workspaceCommandPort,
    workspaceQueryPort,
  };
}