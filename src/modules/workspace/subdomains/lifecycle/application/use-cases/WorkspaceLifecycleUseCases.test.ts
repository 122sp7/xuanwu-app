import { describe, expect, it } from 'vitest';
import {
  CreateWorkspaceWithOwnerUseCase,
} from './WorkspaceLifecycleUseCases';
import type { WorkspaceSnapshot } from '../../domain/entities/Workspace';
import type { WorkspaceRepository } from '../../domain/repositories/WorkspaceRepository';
import type { WorkspaceMemberSnapshot } from '../../../membership/domain/entities/WorkspaceMember';
import type { WorkspaceMemberRepository } from '../../../membership/domain/repositories/WorkspaceMemberRepository';

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

describe('CreateWorkspaceWithOwnerUseCase', () => {
  it('creates workspace and owner membership together', async () => {
    const workspaceRepo = new InMemoryWorkspaceRepository();
    const memberRepo = new InMemoryWorkspaceMemberRepository();
    const useCase = new CreateWorkspaceWithOwnerUseCase(workspaceRepo, memberRepo);

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
  });
});
