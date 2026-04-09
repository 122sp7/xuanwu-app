import type { CommandResult } from "@shared-types";

import type {
  Capability,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";

export interface WorkspaceCommandPort {
  createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult>;
  createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult>;
  updateWorkspaceSettings(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult>;
  deleteWorkspace(workspaceId: string): Promise<CommandResult>;
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<CommandResult>;
  authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult>;
  grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult>;
  createWorkspaceLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult>;
}