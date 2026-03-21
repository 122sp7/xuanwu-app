"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
  UpdateWorkspaceSettingsUseCase,
  DeleteWorkspaceUseCase,
  MountCapabilitiesUseCase,
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "../../application/use-cases/workspace.use-cases";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";

const workspaceRepo = new FirebaseWorkspaceRepository();

export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceUseCase(workspaceRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceWithCapabilitiesUseCase(workspaceRepo).execute(command, capabilities);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult> {
  try {
    return await new UpdateWorkspaceSettingsUseCase(workspaceRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteWorkspace(workspaceId: string): Promise<CommandResult> {
  try {
    return await new DeleteWorkspaceUseCase(workspaceRepo).execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult> {
  try {
    return await new MountCapabilitiesUseCase(workspaceRepo).execute(workspaceId, capabilities);
  } catch (err) {
    return commandFailureFrom("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new GrantTeamAccessUseCase(workspaceRepo).execute(workspaceId, teamId);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_TEAM_AUTHORIZE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  try {
    return await new GrantIndividualAccessUseCase(workspaceRepo).execute(workspaceId, grant);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceLocationUseCase(workspaceRepo).execute(workspaceId, location);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
