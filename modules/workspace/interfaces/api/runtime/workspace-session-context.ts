import type { WorkspaceCommandPort } from "../../../domain/ports/input/WorkspaceCommandPort";
import type { WorkspaceQueryPort } from "../../../domain/ports/input/WorkspaceQueryPort";

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