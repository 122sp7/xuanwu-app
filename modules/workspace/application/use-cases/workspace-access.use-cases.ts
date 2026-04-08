/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace access use cases — team grants, individual grants, locations.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceAccessRepository } from "../../domain/repositories/WorkspaceAccessRepository";
import type { WorkspaceLocationRepository } from "../../domain/repositories/WorkspaceLocationRepository";
import type { WorkspaceGrant, WorkspaceLocation } from "../../domain/entities/Workspace";

// ─── Grant Team Access ────────────────────────────────────────────────────────

export class GrantTeamAccessUseCase {
  constructor(private readonly workspaceAccessRepo: WorkspaceAccessRepository) {}

  async execute(workspaceId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.workspaceAccessRepo.grantTeamAccess(workspaceId, teamId);
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
  constructor(private readonly workspaceAccessRepo: WorkspaceAccessRepository) {}

  async execute(workspaceId: string, grant: WorkspaceGrant): Promise<CommandResult> {
    try {
      await this.workspaceAccessRepo.grantIndividualAccess(workspaceId, grant);
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
  constructor(private readonly workspaceLocationRepo: WorkspaceLocationRepository) {}

  async execute(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult> {
    try {
      const locationId = await this.workspaceLocationRepo.createLocation(workspaceId, location);
      return commandSuccess(locationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_LOCATION_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace location",
      );
    }
  }
}
