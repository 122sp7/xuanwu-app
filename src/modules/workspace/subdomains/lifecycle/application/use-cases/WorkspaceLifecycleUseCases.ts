import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { Workspace } from "../../domain/entities/Workspace";
import type { CreateWorkspaceInput } from "../../domain/entities/Workspace";
import { WorkspaceMember } from "../../../membership/domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../../membership/domain/repositories/WorkspaceMemberRepository";

interface CreateWorkspaceWithOwnerInput {
  readonly workspace: CreateWorkspaceInput;
  readonly owner: {
    readonly actorId: string;
    readonly displayName: string;
    readonly email?: string;
  };
}

export class CreateWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(input: CreateWorkspaceInput): Promise<CommandResult> {
    try {
      const workspace = Workspace.create(uuid(), input);
      await this.workspaceRepo.save(workspace.getSnapshot());
      return commandSuccess(workspace.id, Date.now());
    } catch (err) {
      return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace.");
    }
  }
}

export class CreateWorkspaceWithOwnerUseCase {
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly memberRepo: WorkspaceMemberRepository,
  ) {}

  async execute(input: CreateWorkspaceWithOwnerInput): Promise<CommandResult> {
    try {
      const workspace = Workspace.create(uuid(), input.workspace);
      await this.workspaceRepo.save(workspace.getSnapshot());
      try {
        const ownerMember = WorkspaceMember.add(uuid(), {
          workspaceId: workspace.id,
          actorId: input.owner.actorId,
          role: "owner",
          displayName: input.owner.displayName,
          email: input.owner.email,
        });
        await this.memberRepo.save(ownerMember.getSnapshot());
      } catch (memberErr) {
        await this.workspaceRepo.delete(workspace.id);
        throw memberErr;
      }

      return commandSuccess(workspace.id, Date.now());
    } catch (err) {
      return commandFailureFrom("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace.");
    }
  }
}

export class ActivateWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.workspaceRepo.findById(workspaceId);
      if (!snapshot) return commandFailureFrom("WORKSPACE_NOT_FOUND", "Workspace not found.");
      const workspace = Workspace.reconstitute(snapshot);
      workspace.activate();
      await this.workspaceRepo.save(workspace.getSnapshot());
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom("WORKSPACE_ACTIVATE_FAILED", err instanceof Error ? err.message : "Failed to activate workspace.");
    }
  }
}

export class StopWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.workspaceRepo.findById(workspaceId);
      if (!snapshot) return commandFailureFrom("WORKSPACE_NOT_FOUND", "Workspace not found.");
      const workspace = Workspace.reconstitute(snapshot);
      workspace.stop();
      await this.workspaceRepo.save(workspace.getSnapshot());
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom("WORKSPACE_STOP_FAILED", err instanceof Error ? err.message : "Failed to stop workspace.");
    }
  }
}

export class DeleteWorkspaceUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const existing = await this.workspaceRepo.findById(workspaceId);
      if (!existing) return commandFailureFrom("WORKSPACE_NOT_FOUND", "Workspace not found.");
      await this.workspaceRepo.delete(workspaceId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Failed to delete workspace.");
    }
  }
}
