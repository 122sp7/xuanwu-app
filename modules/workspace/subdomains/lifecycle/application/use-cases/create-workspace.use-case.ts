/**
 * Lifecycle Subdomain — Create Workspace Use Case
 *
 * Business intent: Provision a new workspace container within an account scope.
 *
 * DDD Rule 1: Has business behavior (aggregate creation, initial state setup)
 * DDD Rule 2: Has flow (validation → creation → persistence → event)
 * DDD Rule 8: One use case = one business intent (verb: Create)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateWorkspaceCommand } from "../../domain";
import type { Capability } from "../../../../domain/aggregates/Workspace";
import {
  createWorkspaceAggregate,
  toWorkspaceSnapshot,
} from "../../../../domain/factories/WorkspaceFactory";
import type {
  WorkspaceRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../domain/ports";
import { createWorkspaceCreatedEvent } from "../../domain";

interface CreateWorkspaceDeps {
  readonly workspaceRepo: WorkspaceRepository;
  readonly workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  readonly eventPublisher: WorkspaceDomainEventPublisher;
}

function buildEventMetadata(
  workspaceId: string,
  accountId: string,
  accountType: "user" | "organization",
): WorkspaceEventPublishMetadata {
  return {
    workspaceId,
    organizationId: accountType === "organization" ? accountId : undefined,
  };
}

export class CreateWorkspaceUseCase {
  constructor(private readonly deps: CreateWorkspaceDeps) {}

  async execute(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.deps.workspaceRepo.save(toWorkspaceSnapshot(workspace));

      await this.deps.eventPublisher.publish(
        createWorkspaceCreatedEvent({
          workspaceId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        buildEventMetadata(workspaceId, command.accountId, command.accountType),
      );

      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace",
      );
    }
  }
}

export class CreateWorkspaceWithCapabilitiesUseCase {
  constructor(private readonly deps: CreateWorkspaceDeps) {}

  async execute(
    command: CreateWorkspaceCommand,
    capabilities: Capability[] = [],
  ): Promise<CommandResult> {
    try {
      const workspace = createWorkspaceAggregate(command);
      const workspaceId = await this.deps.workspaceRepo.save(toWorkspaceSnapshot(workspace));

      if (capabilities.length > 0) {
        await this.deps.workspaceCapabilityRepo.mountCapabilities(workspaceId, capabilities);
      }

      await this.deps.eventPublisher.publish(
        createWorkspaceCreatedEvent({
          workspaceId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        buildEventMetadata(workspaceId, command.accountId, command.accountType),
      );

      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_WITH_CAPABILITIES_FAILED",
        err instanceof Error ? err.message : "Failed to create workspace with capabilities",
      );
    }
  }
}
