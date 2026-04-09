/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Workspace read use cases — thin query orchestration.
 */

import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceRepository } from "../../ports/output/WorkspaceRepository";
import type {
  Unsubscribe,
  WorkspaceQueryRepository,
} from "../../ports/output/WorkspaceQueryRepository";

export class ListWorkspacesForAccountUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(accountId: string): Promise<WorkspaceEntity[]> {
    const normalizedAccountId = accountId.trim();
    if (!normalizedAccountId) {
      return [];
    }

    return this.workspaceRepo.findAllByAccountId(normalizedAccountId);
  }
}

export class SubscribeToWorkspacesForAccountUseCase {
  constructor(private readonly workspaceQueryRepo: WorkspaceQueryRepository) {}

  execute(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe {
    const normalizedAccountId = accountId.trim();
    if (!normalizedAccountId) {
      onUpdate([]);
      return () => {};
    }

    return this.workspaceQueryRepo.subscribeToWorkspacesForAccount(
      normalizedAccountId,
      onUpdate,
    );
  }
}

export class GetWorkspaceByIdUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceEntity | null> {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
      return null;
    }

    return this.workspaceRepo.findById(normalizedWorkspaceId);
  }
}

export class GetWorkspaceByIdForAccountUseCase {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null> {
    const normalizedAccountId = accountId.trim();
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedAccountId || !normalizedWorkspaceId) {
      return null;
    }

    return this.workspaceRepo.findByIdForAccount(
      normalizedAccountId,
      normalizedWorkspaceId,
    );
  }
}