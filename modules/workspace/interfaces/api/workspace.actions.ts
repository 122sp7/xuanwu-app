"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Input Port.
 */

import type { CommandResult } from "@shared-types";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "./contracts";
import { workspaceCommandPort } from "./workspace-runtime";

export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
  return workspaceCommandPort.createWorkspace(command);
}

export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult> {
  return workspaceCommandPort.createWorkspaceWithCapabilities(command, capabilities);
}

export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult> {
  return workspaceCommandPort.updateWorkspaceSettings(command);
}

export async function deleteWorkspace(workspaceId: string): Promise<CommandResult> {
  return workspaceCommandPort.deleteWorkspace(workspaceId);
}

export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult> {
  return workspaceCommandPort.mountCapabilities(workspaceId, capabilities);
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  return workspaceCommandPort.authorizeWorkspaceTeam(workspaceId, teamId);
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  return workspaceCommandPort.grantIndividualWorkspaceAccess(workspaceId, grant);
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  return workspaceCommandPort.createWorkspaceLocation(workspaceId, location);
}
