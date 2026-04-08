"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
  UpdateWorkspaceSettingsUseCase,
  DeleteWorkspaceUseCase,
  MountCapabilitiesUseCase,
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "../../application/use-cases/workspace.use-cases";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import type {
  WorkspaceAccessRepository,
  WorkspaceCapabilityRepository,
  WorkspaceLocationRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../ports";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
  WorkspaceDomainEvent,
} from "../../api/contracts";
import {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../api/contracts";
import { SharedWorkspaceDomainEventPublisher } from "../../infrastructure/events/SharedWorkspaceDomainEventPublisher";

const workspaceRepo = new FirebaseWorkspaceRepository();
const workspaceCapabilityRepo: WorkspaceCapabilityRepository = workspaceRepo;
const workspaceAccessRepo: WorkspaceAccessRepository = workspaceRepo;
const workspaceLocationRepo: WorkspaceLocationRepository = workspaceRepo;
const workspaceDomainEventPublisher: WorkspaceDomainEventPublisher =
  new SharedWorkspaceDomainEventPublisher();

async function publishWorkspaceDomainEvent(
  event: WorkspaceDomainEvent,
  metadata?: WorkspaceEventPublishMetadata,
): Promise<void> {
  await workspaceDomainEventPublisher.publish(event, metadata);
}

function createWorkspaceEventMetadata(
  workspaceId: string,
  accountId: string,
  accountType?: "user" | "organization",
): WorkspaceEventPublishMetadata {
  return {
    workspaceId,
    organizationId: accountType === "organization" ? accountId : undefined,
  };
}

export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
  try {
    const result = await new CreateWorkspaceUseCase(workspaceRepo).execute(command);
    if (result.success) {
      await publishWorkspaceDomainEvent(
        createWorkspaceCreatedEvent({
          workspaceId: result.aggregateId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        createWorkspaceEventMetadata(result.aggregateId, command.accountId, command.accountType),
      );
    }
    return result;
  } catch (err) {
    return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult> {
  try {
    const result = await new CreateWorkspaceWithCapabilitiesUseCase(
      workspaceRepo,
      workspaceCapabilityRepo,
    ).execute(command, capabilities);
    if (result.success) {
      await publishWorkspaceDomainEvent(
        createWorkspaceCreatedEvent({
          workspaceId: result.aggregateId,
          accountId: command.accountId,
          accountType: command.accountType,
          name: command.name,
        }),
        createWorkspaceEventMetadata(result.aggregateId, command.accountId, command.accountType),
      );
    }
    return result;
  } catch (err) {
    return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult> {
  try {
    const previous = await workspaceRepo.findByIdForAccount(command.accountId, command.workspaceId);
    const result = await new UpdateWorkspaceSettingsUseCase(workspaceRepo).execute(command);

    if (result.success && previous) {
      if (
        command.lifecycleState !== undefined &&
        command.lifecycleState !== previous.lifecycleState
      ) {
        await publishWorkspaceDomainEvent(
          createWorkspaceLifecycleTransitionedEvent({
            workspaceId: command.workspaceId,
            accountId: command.accountId,
            fromState: previous.lifecycleState,
            toState: command.lifecycleState,
          }),
          createWorkspaceEventMetadata(command.workspaceId, command.accountId, previous.accountType),
        );
      }

      if (
        command.visibility !== undefined &&
        command.visibility !== previous.visibility
      ) {
        await publishWorkspaceDomainEvent(
          createWorkspaceVisibilityChangedEvent({
            workspaceId: command.workspaceId,
            accountId: command.accountId,
            fromVisibility: previous.visibility,
            toVisibility: command.visibility,
          }),
          createWorkspaceEventMetadata(command.workspaceId, command.accountId, previous.accountType),
        );
      }
    }

    return result;
  } catch (err) {
    return commandFailureFrom("WORKSPACE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteWorkspace(workspaceId: string): Promise<CommandResult> {
  try {
    return await new DeleteWorkspaceUseCase(workspaceRepo).execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult> {
  try {
    return await new MountCapabilitiesUseCase(workspaceCapabilityRepo).execute(
      workspaceId,
      capabilities,
    );
  } catch (err) {
    return commandFailureFrom("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new GrantTeamAccessUseCase(workspaceAccessRepo).execute(workspaceId, teamId);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_TEAM_AUTHORIZE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  try {
    return await new GrantIndividualAccessUseCase(workspaceAccessRepo).execute(
      workspaceId,
      grant,
    );
  } catch (err) {
    return commandFailureFrom("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceLocationUseCase(workspaceLocationRepo).execute(
      workspaceId,
      location,
    );
  } catch (err) {
    return commandFailureFrom("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
