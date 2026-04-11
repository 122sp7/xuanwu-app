/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace location use case — part of workspace operational profile.
 *
 * DDD Rule 1: Has business behavior (location creation within workspace scope)
 * DDD Rule 8: One use case = one business intent (verb: Create)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceLocationRepository } from "../../domain/ports/output/WorkspaceLocationRepository";
import type { WorkspaceLocation } from "../../domain/aggregates/Workspace";

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
