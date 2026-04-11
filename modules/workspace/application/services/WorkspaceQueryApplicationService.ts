import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../domain/entities/WikiContentTree";
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMemberView";
import {
  getWorkspaceByIdForAccount,
  getWorkspaceById,
  listWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
} from "../queries/workspace.queries";
import { fetchWorkspaceMembers } from "../queries/workspace-member.queries";
import { buildWikiContentTree } from "../queries/wiki-content-tree.queries";
import type { WorkspaceQueryPort } from "../../domain/ports/input/WorkspaceQueryPort";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceQueryRepository } from "../../domain/ports/output/WorkspaceQueryRepository";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type { WikiWorkspaceRepository } from "../../domain/ports/output/WikiWorkspaceRepository";

interface WorkspaceQueryApplicationServiceDependencies {
  workspaceRepo: WorkspaceRepository;
  workspaceQueryRepo: WorkspaceQueryRepository;
  wikiWorkspaceRepo: WikiWorkspaceRepository;
}

export class WorkspaceQueryApplicationService implements WorkspaceQueryPort {
  constructor(
    private readonly dependencies: WorkspaceQueryApplicationServiceDependencies,
  ) {}

  getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
    return listWorkspacesForAccount(this.dependencies.workspaceRepo, accountId);
  }

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    return subscribeToWorkspacesForAccount(
      this.dependencies.workspaceQueryRepo,
      accountId,
      onUpdate,
    );
  }

  getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
    return getWorkspaceById(this.dependencies.workspaceRepo, workspaceId);
  }

  getWorkspaceByIdForAccount(
    accountId: string,
    workspaceId: string,
  ): Promise<WorkspaceEntity | null> {
    return getWorkspaceByIdForAccount(this.dependencies.workspaceRepo, accountId, workspaceId);
  }

  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
    return fetchWorkspaceMembers(this.dependencies.workspaceQueryRepo, workspaceId);
  }

  buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]> {
    return buildWikiContentTree(seeds, this.dependencies.wikiWorkspaceRepo);
  }
}
