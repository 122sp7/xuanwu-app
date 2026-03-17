/**
 * Workspace Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@/shared/types";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";

// ─── Create Workspace ─────────────────────────────────────────────────────────

export class CreateWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const workspaceId = await this.workspaceRepo.save({
        id: crypto.randomUUID(),
        name: command.name,
        accountId: command.accountId,
        accountType: command.accountType,
        lifecycleState: "preparatory",
        visibility: "visible",
        capabilities: [],
        grants: [],
        teamIds: [],
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
      });
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace",
      );
    }
  }
}

// ─── Create Workspace with Capabilities ──────────────────────────────────────

export class CreateWorkspaceWithCapabilitiesUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(
    command: CreateWorkspaceCommand,
    capabilities: Capability[] = [],
  ): Promise<CommandResult> {
    try {
      const workspaceId = await this.workspaceRepo.save({
        id: crypto.randomUUID(),
        name: command.name,
        accountId: command.accountId,
        accountType: command.accountType,
        lifecycleState: "preparatory",
        visibility: "visible",
        capabilities: [],
        grants: [],
        teamIds: [],
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
      });
      if (capabilities.length > 0) {
        await this.workspaceRepo.mountCapabilities(workspaceId, capabilities);
      }
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_WITH_CAPABILITIES_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace with capabilities",
      );
    }
  }
}

// ─── Update Settings ──────────────────────────────────────────────────────────

export class UpdateWorkspaceSettingsUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult> {
    try {
      const workspace = await this.workspaceRepo.findById(command.workspaceId);
      if (!workspace) {
        return commandFailureFrom(
          "WORKSPACE_NOT_FOUND",
          `Workspace ${command.workspaceId} not found`,
        );
      }
      await this.workspaceRepo.updateSettings(command);
      return commandSuccess(command.workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_UPDATE_FAILED",
        err instanceof Error ? err.message : "Failed to update workspace settings",
      );
    }
  }
}

// ─── Delete Workspace ─────────────────────────────────────────────────────────

export class DeleteWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const workspace = await this.workspaceRepo.findById(workspaceId);
      if (!workspace) {
        return commandFailureFrom("WORKSPACE_NOT_FOUND", `Workspace ${workspaceId} not found`);
      }
      await this.workspaceRepo.delete(workspaceId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_DELETE_FAILED",
        err instanceof Error ? err.message : "Failed to delete workspace",
      );
    }
  }
}

// ─── Mount Capabilities ───────────────────────────────────────────────────────

export class MountCapabilitiesUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string, capabilities: Capability[]): Promise<CommandResult> {
    try {
      await this.workspaceRepo.mountCapabilities(workspaceId, capabilities);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CAPABILITIES_MOUNT_FAILED",
        err instanceof Error ? err.message : "Failed to mount capabilities",
      );
    }
  }
}

// ─── Grant Team Access ────────────────────────────────────────────────────────

export class GrantTeamAccessUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.workspaceRepo.grantTeamAccess(workspaceId, teamId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_TEAM_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant team access",
      );
    }
  }
}

// ─── Grant Individual Access ──────────────────────────────────────────────────

export class GrantIndividualAccessUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string, grant: WorkspaceGrant): Promise<CommandResult> {
    try {
      await this.workspaceRepo.grantIndividualAccess(workspaceId, grant);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant individual access",
      );
    }
  }
}

// ─── Create Location ──────────────────────────────────────────────────────────

export class CreateWorkspaceLocationUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult> {
    try {
      const locationId = await this.workspaceRepo.createLocation(workspaceId, location);
      return commandSuccess(locationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_LOCATION_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace location",
      );
    }
  }
}
