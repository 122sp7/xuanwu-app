/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace capabilities use case — mount feature flags.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type { Capability } from "../../domain/entities/Workspace";

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
