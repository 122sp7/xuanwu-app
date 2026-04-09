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
} from "../use-cases/workspace.use-cases";
import type { WorkspaceCommandPort } from "../../ports/input/WorkspaceCommandPort";
import type {
  WorkspaceAccessRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
  WorkspaceLocationRepository,
  WorkspaceRepository,
} from "../../ports";
import type {
  Capability,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";
import {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
  type WorkspaceDomainEvent,
} from "../../domain/events/workspace.events";

interface WorkspaceCommandApplicationServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  workspaceAccessRepo: WorkspaceAccessRepository;
  workspaceLocationRepo: WorkspaceLocationRepository;
  workspaceDomainEventPublisher: WorkspaceDomainEventPublisher;
}

export class WorkspaceCommandApplicationService implements WorkspaceCommandPort {
  constructor(
    private readonly dependencies: WorkspaceCommandApplicationServiceDependencies,
  ) {}

  async createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
    try {
      const result = await new CreateWorkspaceUseCase(this.dependencies.workspaceRepo).execute(command);
      if (result.success) {
        await this.publishWorkspaceDomainEvent(
          createWorkspaceCreatedEvent({
            workspaceId: result.aggregateId,
            accountId: command.accountId,
            accountType: command.accountType,
            name: command.name,
          }),
          this.createWorkspaceEventMetadata(
            result.aggregateId,
            command.accountId,
            command.accountType,
          ),
        );
      }
      return result;
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    try {
      const result = await new CreateWorkspaceWithCapabilitiesUseCase(
        this.dependencies.workspaceRepo,
        this.dependencies.workspaceCapabilityRepo,
      ).execute(command, capabilities);
      if (result.success) {
        await this.publishWorkspaceDomainEvent(
          createWorkspaceCreatedEvent({
            workspaceId: result.aggregateId,
            accountId: command.accountId,
            accountType: command.accountType,
            name: command.name,
          }),
          this.createWorkspaceEventMetadata(
            result.aggregateId,
            command.accountId,
            command.accountType,
          ),
        );
      }
      return result;
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_CREATE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async updateWorkspaceSettings(
    command: UpdateWorkspaceSettingsCommand,
  ): Promise<CommandResult> {
    try {
      const previous = await this.dependencies.workspaceRepo.findByIdForAccount(
        command.accountId,
        command.workspaceId,
      );
      const result = await new UpdateWorkspaceSettingsUseCase(this.dependencies.workspaceRepo).execute(
        command,
      );

      if (result.success && previous) {
        if (
          command.lifecycleState !== undefined &&
          command.lifecycleState !== previous.lifecycleState
        ) {
          await this.publishWorkspaceDomainEvent(
            createWorkspaceLifecycleTransitionedEvent({
              workspaceId: command.workspaceId,
              accountId: command.accountId,
              fromState: previous.lifecycleState,
              toState: command.lifecycleState,
            }),
            this.createWorkspaceEventMetadata(
              command.workspaceId,
              command.accountId,
              previous.accountType,
            ),
          );
        }

        if (command.visibility !== undefined && command.visibility !== previous.visibility) {
          await this.publishWorkspaceDomainEvent(
            createWorkspaceVisibilityChangedEvent({
              workspaceId: command.workspaceId,
              accountId: command.accountId,
              fromVisibility: previous.visibility,
              toVisibility: command.visibility,
            }),
            this.createWorkspaceEventMetadata(
              command.workspaceId,
              command.accountId,
              previous.accountType,
            ),
          );
        }
      }

      return result;
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_UPDATE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async deleteWorkspace(workspaceId: string): Promise<CommandResult> {
    try {
      return await new DeleteWorkspaceUseCase(this.dependencies.workspaceRepo).execute(workspaceId);
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_DELETE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async mountCapabilities(
    workspaceId: string,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    try {
      return await new MountCapabilitiesUseCase(this.dependencies.workspaceCapabilityRepo).execute(
        workspaceId,
        capabilities,
      );
    } catch (err) {
      return commandFailureFrom(
        "CAPABILITIES_MOUNT_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult> {
    try {
      return await new GrantTeamAccessUseCase(this.dependencies.workspaceAccessRepo).execute(
        workspaceId,
        teamId,
      );
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_TEAM_AUTHORIZE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult> {
    try {
      return await new GrantIndividualAccessUseCase(this.dependencies.workspaceAccessRepo).execute(
        workspaceId,
        grant,
      );
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_GRANT_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  async createWorkspaceLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<CommandResult> {
    try {
      return await new CreateWorkspaceLocationUseCase(this.dependencies.workspaceLocationRepo).execute(
        workspaceId,
        location,
      );
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_LOCATION_CREATE_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }

  private async publishWorkspaceDomainEvent(
    event: WorkspaceDomainEvent,
    metadata?: WorkspaceEventPublishMetadata,
  ): Promise<void> {
    await this.dependencies.workspaceDomainEventPublisher.publish(event, metadata);
  }

  private createWorkspaceEventMetadata(
    workspaceId: string,
    accountId: string,
    accountType?: "user" | "organization",
  ): WorkspaceEventPublishMetadata {
    return {
      workspaceId,
      organizationId: accountType === "organization" ? accountId : undefined,
    };
  }
}