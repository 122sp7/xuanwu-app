/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace lifecycle use cases — create and delete.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type { WorkspaceCapabilityRepository } from "../../domain/repositories/WorkspaceCapabilityRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceEntity,
} from "../../domain/entities/Workspace";
import { createAddress } from "../../domain/value-objects/Address";
import { createWorkspaceLifecycleState } from "../../domain/value-objects/WorkspaceLifecycleState";
import { createWorkspaceName } from "../../domain/value-objects/WorkspaceName";
import { createWorkspaceVisibility } from "../../domain/value-objects/WorkspaceVisibility";

function createInitialWorkspaceEntity(command: CreateWorkspaceCommand): WorkspaceEntity {
  return {
    id: crypto.randomUUID(),
    name: createWorkspaceName(command.name),
    accountId: command.accountId,
    accountType: command.accountType,
    lifecycleState: createWorkspaceLifecycleState("preparatory"),
    visibility: createWorkspaceVisibility("visible"),
    capabilities: [],
    grants: [],
    teamIds: [],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
  };
}

function sanitizeWorkspaceSettingsCommand(
  command: UpdateWorkspaceSettingsCommand,
): UpdateWorkspaceSettingsCommand {
  return {
    ...command,
    name: command.name !== undefined ? createWorkspaceName(command.name) : undefined,
    visibility:
      command.visibility !== undefined
        ? createWorkspaceVisibility(command.visibility)
        : undefined,
    lifecycleState:
      command.lifecycleState !== undefined
        ? createWorkspaceLifecycleState(command.lifecycleState)
        : undefined,
    address: command.address !== undefined ? createAddress(command.address) : undefined,
  };
}

// ─── Create Workspace ─────────────────────────────────────────────────────────

export class CreateWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const workspaceId = await this.workspaceRepo.save(createInitialWorkspaceEntity(command));
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
      const workspaceId = await this.workspaceRepo.save(createInitialWorkspaceEntity(command));
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
      await this.workspaceRepo.updateSettings(sanitizeWorkspaceSettingsCommand(command));
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
