/**
 * Sharing Subdomain — Grant Team Access Use Case
 *
 * Business intent: Authorize a team to access a workspace.
 *
 * DDD Rule 1: Has business behavior (authorization grant)
 * DDD Rule 8: One use case = one business intent (verb: Grant)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceAccessRepository } from "../../domain/ports";

interface GrantTeamAccessDeps {
  readonly workspaceAccessRepo: WorkspaceAccessRepository;
}

export class GrantTeamAccessUseCase {
  constructor(private readonly deps: GrantTeamAccessDeps) {}

  async execute(workspaceId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.deps.workspaceAccessRepo.grantTeamAccess(workspaceId, teamId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_TEAM_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant team access",
      );
    }
  }
}
