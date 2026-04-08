/**
 * WorkspaceRepository — Port for workspace persistence.
 */

import type {
  WorkspaceEntity,
  UpdateWorkspaceSettingsCommand,
} from "../entities/Workspace";

export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>;
  findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>;
  save(workspace: WorkspaceEntity): Promise<string>;
  updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>;
  delete(id: string): Promise<void>;
}
