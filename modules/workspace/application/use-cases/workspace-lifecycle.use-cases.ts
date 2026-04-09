/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace lifecycle use cases — create and delete.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../ports/output/WorkspaceRepository";
import type { WorkspaceCapabilityRepository } from "../../ports/output/WorkspaceCapabilityRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
} from "../../domain/entities/Workspace";
import {
  createWorkspaceAggregate,
  reconstituteWorkspaceAggregate,
  toWorkspaceSnapshot,
} from "../../domain/factories/WorkspaceFactory";
import type { Workspace } from "../../domain/entities/Workspace";

function sanitizeWorkspaceSettingsCommand(
  workspace: Workspace,
  command: UpdateWorkspaceSettingsCommand,
): UpdateWorkspaceSettingsCommand {
  workspace.applySettings(command);

  return {
    workspaceId: command.workspaceId,
    accountId: command.accountId,
    name: command.name !== undefined ? workspace.name : undefined,
    visibility: command.visibility !== undefined ? workspace.visibility : undefined,
    lifecycleState:
      command.lifecycleState !== undefined ? workspace.lifecycleState : undefined,
    address: command.address !== undefined ? workspace.address : undefined,
    personnel: command.personnel !== undefined ? workspace.personnel : undefined,
  };
}

// ─── Create Workspace ─────────────────────────────────────────────────────────

export class CreateWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.workspaceRepo.save(toWorkspaceSnapshot(workspace));
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
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly capabilityRepo: WorkspaceCapabilityRepository,
  ) {}

  async execute(
    command: CreateWorkspaceCommand,
    capabilities: Capability[] = [],
  ): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.workspaceRepo.save(toWorkspaceSnapshot(workspace));
      if (capabilities.length > 0) {
        await this.capabilityRepo.mountCapabilities(workspaceId, capabilities);
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
      const workspace = await this.workspaceRepo.findByIdForAccount(
        command.accountId,
        command.workspaceId,
      );
      if (!workspace) {
        return commandFailureFrom(
          "WORKSPACE_NOT_FOUND",
          `Workspace ${command.workspaceId} not found`,
        );
      }
      await this.workspaceRepo.updateSettings(
        sanitizeWorkspaceSettingsCommand(
          reconstituteWorkspaceAggregate(workspace),
          command,
        ),
      );
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
