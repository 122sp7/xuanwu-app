import { describe, expect, it } from 'vitest';
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithOwnerUseCase,
} from './WorkspaceLifecycleUseCases';
import type { WorkspaceSnapshot } from '../../domain/entities/Workspace';
import type { WorkspaceRepository } from '../../domain/repositories/WorkspaceRepository';
import type { WorkspaceMemberSnapshot } from '../../../membership/domain/entities/WorkspaceMember';
import type { WorkspaceMemberRepository } from '../../../membership/domain/repositories/WorkspaceMemberRepository';
import type { AuditEntrySnapshot } from '../../../audit/domain/entities/AuditEntry';
import type { AuditRepository } from '../../../audit/domain/repositories/AuditRepository';

class InMemoryWorkspaceRepository implements WorkspaceRepository {
  private readonly items = new Map<string, WorkspaceSnapshot>();

  async findById(workspaceId: string): Promise<WorkspaceSnapshot | null> {
    return this.items.get(workspaceId) ?? null;
  }

  async findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]> {
    return [...this.items.values()].filter((item) => item.accountId === accountId);
  }

  async save(workspace: WorkspaceSnapshot): Promise<void> {
    this.items.set(workspace.id, workspace);
  }

  async delete(workspaceId: string): Promise<void> {
    this.items.delete(workspaceId);
  }
}

class InMemoryWorkspaceRepositoryWithDeleteFailure extends InMemoryWorkspaceRepository {
  async delete(_workspaceId: string): Promise<void> {
    throw new Error("rollback-delete-failed");
  }
}

class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
  private readonly items = new Map<string, WorkspaceMemberSnapshot>();

  async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null> {
    return this.items.get(memberId) ?? null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]> {
    return [...this.items.values()].filter((item) => item.workspaceId === workspaceId);
  }

  async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null> {
    return [...this.items.values()].find((item) => item.actorId === actorId && item.workspaceId === workspaceId) ?? null;
  }

  async save(member: WorkspaceMemberSnapshot): Promise<void> {
    this.items.set(member.id, member);
  }

  async delete(memberId: string): Promise<void> {
    this.items.delete(memberId);
  }
}

class InMemoryAuditRepository implements AuditRepository {
  private readonly entries: AuditEntrySnapshot[] = [];

  async save(entry: AuditEntrySnapshot): Promise<void> {
    this.entries.push(entry);
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]> {
    return this.entries.filter((entry) => entry.workspaceId === workspaceId);
  }

  async findByWorkspaceIds(workspaceIds: string[]): Promise<AuditEntrySnapshot[]> {
    return this.entries.filter((entry) => workspaceIds.includes(entry.workspaceId));
  }
}

describe('CreateWorkspaceWithOwnerUseCase', () => {
  it('auto-assigns creator as owner when create use case receives creator input', async () => {
    const workspaceRepo = new InMemoryWorkspaceRepository();
    const memberRepo = new InMemoryWorkspaceMemberRepository();
    const useCase = new CreateWorkspaceUseCase(workspaceRepo, memberRepo);

    const result = await useCase.execute({
      accountId: 'org-1',
      accountType: 'organization',
      name: 'Auto Owner Workspace',
      creator: {
        actorId: 'creator-1',
        displayName: 'Creator Name',
        email: 'creator@example.com',
      },
    });

    expect(result.success).toBe(true);
    expect(result.aggregateId).toBeTruthy();

    const members = await memberRepo.findByWorkspaceId(result.aggregateId);
    expect(members).toHaveLength(1);
    expect(members[0]?.role).toBe('owner');
    expect(members[0]?.actorId).toBe('creator-1');
  });

  it('creates workspace and owner membership together', async () => {
    const workspaceRepo = new InMemoryWorkspaceRepository();
    const memberRepo = new InMemoryWorkspaceMemberRepository();
    const auditRepo = new InMemoryAuditRepository();
    const useCase = new CreateWorkspaceWithOwnerUseCase(workspaceRepo, memberRepo, auditRepo);

    const result = await useCase.execute({
      workspace: {
        accountId: 'org-1',
        accountType: 'organization',
        name: 'Alpha Workspace',
      },
      owner: {
        actorId: 'user-1',
        displayName: 'Owner Name',
        email: 'owner@example.com',
      },
    });

    expect(result.success).toBe(true);
    expect(result.aggregateId).toBeTruthy();

    const workspace = await workspaceRepo.findById(result.aggregateId);
    expect(workspace?.name).toBe('Alpha Workspace');

    const members = await memberRepo.findByWorkspaceId(result.aggregateId);
    expect(members).toHaveLength(1);
    expect(members[0]?.actorId).toBe('user-1');
    expect(members[0]?.role).toBe('owner');
    expect(members[0]?.displayName).toBe('Owner Name');

    const auditEntries = await auditRepo.findByWorkspaceId(result.aggregateId);
    expect(auditEntries).toHaveLength(1);
    expect(auditEntries[0]?.action).toBe('create');
    expect(auditEntries[0]?.resourceType).toBe('workspace');
  });

  it("returns combined error when owner creation and rollback both fail", async () => {
    const workspaceRepo = new InMemoryWorkspaceRepositoryWithDeleteFailure();
    const memberRepo = new InMemoryWorkspaceMemberRepository();
    const useCase = new CreateWorkspaceUseCase(workspaceRepo, {
      ...memberRepo,
      async save(): Promise<void> {
        throw new Error("member-save-failed");
      },
    });

    const result = await useCase.execute({
      accountId: "org-1",
      accountType: "organization",
      name: "Rollback Failure Workspace",
      creator: {
        actorId: "creator-1",
        displayName: "Creator Name",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("WORKSPACE_CREATE_FAILED");
    expect(result.error.message).toContain("member-save-failed");
    expect(result.error.message).toContain("rollback-delete-failed");
  });
});
