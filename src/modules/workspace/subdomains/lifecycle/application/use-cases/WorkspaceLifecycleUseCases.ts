import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { Workspace } from "../../domain/entities/Workspace";
import type { CreateWorkspaceInput } from "../../domain/entities/Workspace";
import { WorkspaceMember } from "../../../membership/domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../../membership/domain/repositories/WorkspaceMemberRepository";
import type { AuditRepository } from "../../../audit/domain/repositories/AuditRepository";
import { AuditEntry } from "../../../audit/domain/entities/AuditEntry";
import { createAuditAction } from "../../../audit/domain/value-objects/AuditAction";
import { createAuditSeverity } from "../../../audit/domain/value-objects/AuditSeverity";

interface CreateWorkspaceWithOwnerInput {
  readonly workspace: CreateWorkspaceInput;
  readonly owner: {
    readonly actorId: string;
    readonly displayName: string;
    readonly email?: string;
  };
}

interface WorkspaceCreatorInput {
  readonly actorId: string;
  readonly displayName: string;
  readonly email?: string;
}

interface CreateWorkspaceWithCreatorInput extends CreateWorkspaceInput {
  readonly creator?: WorkspaceCreatorInput;
}

export class CreateWorkspaceUseCase {
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly memberRepo?: WorkspaceMemberRepository,
    private readonly auditRepo?: AuditRepository,
  ) {}

  async execute(input: CreateWorkspaceWithCreatorInput): Promise<CommandResult> {
    try {
      const workspace = Workspace.create(uuid(), input);
      await this.workspaceRepo.save(workspace.getSnapshot());
      if (input.creator && this.memberRepo) {
        try {
          const ownerMember = WorkspaceMember.add(uuid(), {
            workspaceId: workspace.id,
            actorId: input.creator.actorId,
            role: "owner",
            displayName: input.creator.displayName,
            email: input.creator.email,
          });
          await this.memberRepo.save(ownerMember.getSnapshot());
        } catch (memberErr) {
          try {
            await this.workspaceRepo.delete(workspace.id);
          } catch (rollbackErr) {
            const memberErrorMessage = memberErr instanceof Error ? memberErr.message : "Failed to create owner membership.";
            const rollbackErrorMessage = rollbackErr instanceof Error ? rollbackErr.message : "Failed to rollback workspace creation.";
            throw new Error(`${memberErrorMessage} ${rollbackErrorMessage}`);
          }
          throw memberErr;
        }
      }
      if (input.creator && this.auditRepo) {
        try {
          const workspaceSnapshot = workspace.getSnapshot();
          const auditEntry = AuditEntry.record(uuid(), {
            workspaceId: workspace.id,
            actorId: input.creator.actorId,
            action: createAuditAction("create"),
            resourceType: "workspace",
            resourceId: workspace.id,
            severity: createAuditSeverity("low"),
            detail: `建立工作區「${workspaceSnapshot.name}」`,
            source: "workspace",
            changes: [{
              field: "workspace.name",
              oldValue: null,
              newValue: workspaceSnapshot.name,
            }],
          });
          await this.auditRepo.save(auditEntry.getSnapshot());
        } catch (auditErr) {
          // Best-effort audit logging: do not mask successful workspace creation.
          // Keep a traceable error record for observability.
          console.error("[workspace.lifecycle.create.audit_failed]", {
            workspaceId: workspace.id,
            actorId: input.creator.actorId,
            error: auditErr instanceof Error ? auditErr.message : "unknown",
          });
        }
      }
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
    private readonly auditRepo?: AuditRepository,
  ) {}

  async execute(input: CreateWorkspaceWithOwnerInput): Promise<CommandResult> {
    return new CreateWorkspaceUseCase(this.workspaceRepo, this.memberRepo, this.auditRepo).execute({
      ...input.workspace,
      creator: input.owner,
    });
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
