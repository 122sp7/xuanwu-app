import type { WorkspaceCommandPort } from "../../../application/dtos/workspace-interfaces.dto";
import type { WorkspaceQueryPort } from "../../../application/dtos/workspace-interfaces.dto";

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