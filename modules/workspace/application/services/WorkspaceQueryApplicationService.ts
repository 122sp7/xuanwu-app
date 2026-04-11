import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../domain/entities/WikiContentTree";
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMemberView";
import {
  GetWorkspaceByIdForAccountUseCase,
  GetWorkspaceByIdUseCase,
  ListWorkspacesForAccountUseCase,
  SubscribeToWorkspacesForAccountUseCase,
} from "../queries/workspace.queries";
import { FetchWorkspaceMembersUseCase } from "../use-cases/workspace-member.use-cases";
import { buildWikiContentTree } from "../use-cases/wiki-content-tree.use-case";
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
    return new ListWorkspacesForAccountUseCase(this.dependencies.workspaceRepo).execute(accountId);
  }

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    return new SubscribeToWorkspacesForAccountUseCase(
      this.dependencies.workspaceQueryRepo,
    ).execute(accountId, onUpdate);
  }

  getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
    return new GetWorkspaceByIdUseCase(this.dependencies.workspaceRepo).execute(workspaceId);
  }

  getWorkspaceByIdForAccount(
    accountId: string,
    workspaceId: string,
  ): Promise<WorkspaceEntity | null> {
    return new GetWorkspaceByIdForAccountUseCase(this.dependencies.workspaceRepo).execute(
      accountId,
      workspaceId,
    );
  }

  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
    return new FetchWorkspaceMembersUseCase(this.dependencies.workspaceQueryRepo).execute(workspaceId);
  }

  buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]> {
    return buildWikiContentTree(seeds, this.dependencies.wikiWorkspaceRepo);
  }
}
