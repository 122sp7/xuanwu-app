/**
 * Sharing Subdomain — Application Service
 *
 * Composes sharing use cases with injected dependencies.
 */

import type { CommandResult } from "@shared-types";
import type { WorkspaceGrant } from "../../domain";
import type { WorkspaceAccessRepository } from "../../domain/ports";
import { GrantTeamAccessUseCase } from "../use-cases/grant-team-access.use-case";
import { GrantIndividualAccessUseCase } from "../use-cases/grant-individual-access.use-case";

export interface SharingServiceDependencies {
  workspaceAccessRepo: WorkspaceAccessRepository;
}

export class WorkspaceSharingApplicationService {
  private readonly grantTeamUseCase: GrantTeamAccessUseCase;
  private readonly grantIndividualUseCase: GrantIndividualAccessUseCase;

  constructor(deps: SharingServiceDependencies) {
    this.grantTeamUseCase = new GrantTeamAccessUseCase({
      workspaceAccessRepo: deps.workspaceAccessRepo,
    });
    this.grantIndividualUseCase = new GrantIndividualAccessUseCase({
      workspaceAccessRepo: deps.workspaceAccessRepo,
    });
  }

  authorizeWorkspaceTeam(workspaceId: string, teamId: string): Promise<CommandResult> {
    return this.grantTeamUseCase.execute(workspaceId, teamId);
  }

  grantIndividualWorkspaceAccess(
    workspaceId: string,
    grant: WorkspaceGrant,
  ): Promise<CommandResult> {
    return this.grantIndividualUseCase.execute(workspaceId, grant);
  }
}
