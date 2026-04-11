/**
 * Lifecycle Subdomain — Application Service
 *
 * Composes lifecycle use cases with injected dependencies.
 * This is the subdomain's application-layer entry point.
 */

import type { CommandResult } from "@shared-types";
import type { CreateWorkspaceCommand, UpdateWorkspaceSettingsCommand } from "../../domain";
import type { Capability } from "../../../../domain/aggregates/Workspace";
import type {
  WorkspaceRepository,
  WorkspaceCapabilityRepository,
  WorkspaceDomainEventPublisher,
} from "../../domain/ports";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
} from "../use-cases/create-workspace.use-case";
import { UpdateWorkspaceSettingsUseCase } from "../use-cases/update-workspace-settings.use-case";
import { DeleteWorkspaceUseCase } from "../use-cases/delete-workspace.use-case";

export interface LifecycleServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceCapabilityRepo: WorkspaceCapabilityRepository;
  eventPublisher: WorkspaceDomainEventPublisher;
}

export class WorkspaceLifecycleApplicationService {
  private readonly createUseCase: CreateWorkspaceUseCase;
  private readonly createWithCapsUseCase: CreateWorkspaceWithCapabilitiesUseCase;
  private readonly updateSettingsUseCase: UpdateWorkspaceSettingsUseCase;
  private readonly deleteUseCase: DeleteWorkspaceUseCase;

  constructor(deps: LifecycleServiceDependencies) {
    const createDeps = {
      workspaceRepo: deps.workspaceRepo,
      workspaceCapabilityRepo: deps.workspaceCapabilityRepo,
      eventPublisher: deps.eventPublisher,
    };
    this.createUseCase = new CreateWorkspaceUseCase(createDeps);
    this.createWithCapsUseCase = new CreateWorkspaceWithCapabilitiesUseCase(createDeps);
    this.updateSettingsUseCase = new UpdateWorkspaceSettingsUseCase({
      workspaceRepo: deps.workspaceRepo,
      eventPublisher: deps.eventPublisher,
    });
    this.deleteUseCase = new DeleteWorkspaceUseCase({
      workspaceRepo: deps.workspaceRepo,
    });
  }

  createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
    return this.createUseCase.execute(command);
  }

  createWorkspaceWithCapabilities(
    command: CreateWorkspaceCommand,
    capabilities: Capability[],
  ): Promise<CommandResult> {
    return this.createWithCapsUseCase.execute(command, capabilities);
  }

  updateWorkspaceSettings(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult> {
    return this.updateSettingsUseCase.execute(command);
  }

  deleteWorkspace(workspaceId: string): Promise<CommandResult> {
    return this.deleteUseCase.execute(workspaceId);
  }
}
