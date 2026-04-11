/**
 * Lifecycle Subdomain — Update Workspace Settings Use Case
 *
 * Business intent: Apply setting changes to an existing workspace with
 * domain validation and lifecycle/visibility change event emission.
 *
 * DDD Rule 1: Has business behavior (aggregate reconstitution, state transition)
 * DDD Rule 2: Has flow (fetch → validate → apply → persist → events)
 * DDD Rule 4: Needs consistency (settings + events must be coherent)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { UpdateWorkspaceSettingsCommand, WorkspaceEntity } from "../../domain";
import {
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../domain";
import {
  reconstituteWorkspaceAggregate,
} from "../../../../domain/factories/WorkspaceFactory";
import type {
  WorkspaceRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../domain/ports";
import type { Workspace } from "../../../../domain/aggregates/Workspace";

interface UpdateSettingsDeps {
  readonly workspaceRepo: WorkspaceRepository;
  readonly eventPublisher: WorkspaceDomainEventPublisher;
}

function sanitizeSettings(
  workspace: Workspace,
  command: UpdateWorkspaceSettingsCommand,
): UpdateWorkspaceSettingsCommand {
  workspace.applySettings(command);

  return {
    workspaceId: command.workspaceId,
    accountId: command.accountId,
    name: command.name !== undefined ? workspace.name : undefined,
    visibility: command.visibility !== undefined ? workspace.visibility : undefined,
    lifecycleState: command.lifecycleState !== undefined ? workspace.lifecycleState : undefined,
    address: command.address !== undefined ? workspace.address : undefined,
    personnel: command.personnel !== undefined ? workspace.personnel : undefined,
  };
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

export class UpdateWorkspaceSettingsUseCase {
  constructor(private readonly deps: UpdateSettingsDeps) {}

  async execute(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult> {
    try {
      const previous = await this.deps.workspaceRepo.findByIdForAccount(
        command.accountId,
        command.workspaceId,
      );
      if (!previous) {
        return commandFailureFrom(
          "WORKSPACE_NOT_FOUND",
          `Workspace ${command.workspaceId} not found`,
        );
      }

      const sanitized = sanitizeSettings(reconstituteWorkspaceAggregate(previous), command);
      await this.deps.workspaceRepo.updateSettings(sanitized);

      await this.publishTransitionEvents(command, previous);

      return commandSuccess(command.workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_UPDATE_FAILED",
        err instanceof Error ? err.message : "Failed to update workspace settings",
      );
    }
  }

  private async publishTransitionEvents(
    command: UpdateWorkspaceSettingsCommand,
    previous: WorkspaceEntity,
  ): Promise<void> {
    const metadata = buildEventMetadata(
      command.workspaceId,
      command.accountId,
      previous.accountType,
    );

    if (
      command.lifecycleState !== undefined &&
      command.lifecycleState !== previous.lifecycleState
    ) {
      await this.deps.eventPublisher.publish(
        createWorkspaceLifecycleTransitionedEvent({
          workspaceId: command.workspaceId,
          accountId: command.accountId,
          fromState: previous.lifecycleState,
          toState: command.lifecycleState,
        }),
        metadata,
      );
    }

    if (
      command.visibility !== undefined &&
      command.visibility !== previous.visibility
    ) {
      await this.deps.eventPublisher.publish(
        createWorkspaceVisibilityChangedEvent({
          workspaceId: command.workspaceId,
          accountId: command.accountId,
          fromVisibility: previous.visibility,
          toVisibility: command.visibility,
        }),
        metadata,
      );
    }
  }
}
