import {
  Workspace,
  type CreateWorkspaceCommand,
  type WorkspaceEntity,
} from "../aggregates/Workspace";

export function createWorkspaceAggregate(command: CreateWorkspaceCommand): Workspace {
  return Workspace.create(command);
}

export function reconstituteWorkspaceAggregate(snapshot: WorkspaceEntity): Workspace {
  return Workspace.reconstitute(snapshot);
}

export function toWorkspaceSnapshot(workspace: Workspace): WorkspaceEntity {
  return workspace.toSnapshot();
}
