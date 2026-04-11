import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  MountCapabilitiesUseCase,
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "../use-cases/workspace.use-cases";
import type { WorkspaceCommandPort } from "../../domain/ports/input/WorkspaceCommandPort";
import type {
  WorkspaceAccessRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
  WorkspaceLocationRepository,
  WorkspaceRepository,
} from "../../domain/ports";
import type {
  Capability,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";
import { WorkspaceLifecycleApplicationService } from "../../subdomains/lifecycle/api";

interface WorkspaceCommandApplicationServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  workspaceAccessRepo: WorkspaceAccessRepository;
  workspaceLocationRepo: WorkspaceLocationRepository;
  workspaceDomainEventPublisher: WorkspaceDomainEventPublisher;
}

export class WorkspaceCommandApplicationService implements WorkspaceCommandPort {
  private readonly lifecycleService: WorkspaceLifecycleApplicationService;

  constructor(
    private readonly dependencies: WorkspaceCommandApplicationServiceDependencies,
  ) {
    this.lifecycleService = new WorkspaceLifecycleApplicationService({
      workspaceRepo: dependencies.workspaceRepo,
      workspaceCapabilityRepo: dependencies.workspaceCapabilityRepo,
      eventPublisher: dependencies.workspaceDomainEventPublisher,
    });
  }

  // ─── Lifecycle (delegated to lifecycle subdomain) ───────────────────────────

  async createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
    return this.lifecycleService.createWorkspace(command);
  }

  async createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    return this.lifecycleService.createWorkspaceWithCapabilities(command, capabilities);
  }

  async updateWorkspaceSettings(
    command: UpdateWorkspaceSettingsCommand,
  ): Promise<CommandResult> {
    return this.lifecycleService.updateWorkspaceSettings(command);
  }

  async deleteWorkspace(workspaceId: string): Promise<CommandResult> {
    return this.lifecycleService.deleteWorkspace(workspaceId);
  }

  // ─── Capabilities (root-level, pending subdomain assignment) ────────────────

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

  // ─── Access (root-level, pending sharing subdomain sink) ────────────────────

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

  // ─── Location (root-level, part of Workspace operational profile) ───────────

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
}