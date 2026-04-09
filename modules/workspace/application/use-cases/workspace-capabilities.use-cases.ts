/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace capabilities use case — mount feature flags.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceCapabilityRepository } from "../../ports/output/WorkspaceCapabilityRepository";
import type { Capability } from "../../domain/entities/Workspace";

// ─── Mount Capabilities ───────────────────────────────────────────────────────

export class MountCapabilitiesUseCase {
  constructor(private readonly capabilityRepo: WorkspaceCapabilityRepository) {}

  async execute(workspaceId: string, capabilities: Capability[]): Promise<CommandResult> {
    try {
      await this.capabilityRepo.mountCapabilities(workspaceId, capabilities);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CAPABILITIES_MOUNT_FAILED",
        err instanceof Error ? err.message : "Failed to mount capabilities",
      );
    }
  }
}
