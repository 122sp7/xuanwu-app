/**
 * WorkspaceRepository — Port for workspace persistence.
 */

import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../entities/Workspace";

export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>;
  findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>;
  save(workspace: WorkspaceEntity): Promise<string>;
  updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>;
  delete(id: string): Promise<void>;

  // Capabilities
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;

  // Access Grants
  grantTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>;
  revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>;

  // Locations
  createLocation(workspaceId: string, location: Omit<WorkspaceLocation, "locationId">): Promise<string>;
  updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>;
  deleteLocation(workspaceId: string, locationId: string): Promise<void>;
}
