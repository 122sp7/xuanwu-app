"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import type { DomainEvent, EventMetadata } from "@/modules/shared/api";
import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
  QStashEventBusRepository,
} from "@/modules/shared/api";
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
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";
import {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../domain/events/workspace.events";

const workspaceRepo = new FirebaseWorkspaceRepository();

function makeWorkspaceEventPublisher() {
  const eventBus = process.env.QSTASH_TOKEN
    ? new QStashEventBusRepository()
    : new NoopEventBusRepository();

  return new PublishDomainEventUseCase(
    new InMemoryEventStoreRepository(),
    eventBus,
  );
}

function toEventPayload(event: DomainEvent) {
  const { eventId: _eventId, type: _type, aggregateId: _aggregateId, occurredAt: _occurredAt, ...payload } = event;
  return payload as Record<string, unknown>;
}

async function publishWorkspaceDomainEvent(
  event: DomainEvent,
  metadata?: EventMetadata,
): Promise<void> {
  try {
    await makeWorkspaceEventPublisher().execute({
      id: event.eventId,
      eventName: event.type,
      aggregateType: "Workspace",
      aggregateId: event.aggregateId,
      occurredAt: new Date(event.occurredAt),
      payload: toEventPayload(event),
      metadata,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[workspace.actions] Failed to publish workspace domain event:", error);
    }
  }
}

function createWorkspaceEventMetadata(
  workspaceId: string,
  accountId: string,
  accountType?: "user" | "organization",
): EventMetadata {
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
    const result = await new CreateWorkspaceWithCapabilitiesUseCase(workspaceRepo).execute(command, capabilities);
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
    return await new MountCapabilitiesUseCase(workspaceRepo).execute(workspaceId, capabilities);
  } catch (err) {
    return commandFailureFrom("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new GrantTeamAccessUseCase(workspaceRepo).execute(workspaceId, teamId);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_TEAM_AUTHORIZE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  try {
    return await new GrantIndividualAccessUseCase(workspaceRepo).execute(workspaceId, grant);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceLocationUseCase(workspaceRepo).execute(workspaceId, location);
  } catch (err) {
    return commandFailureFrom("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
