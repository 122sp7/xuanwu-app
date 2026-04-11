/**
 * Sharing Subdomain — Grant Individual Access Use Case
 *
 * Business intent: Grant an individual user access to a workspace.
 *
 * DDD Rule 1: Has business behavior (individual access grant)
 * DDD Rule 8: One use case = one business intent (verb: Grant)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceGrant } from "../../domain";
import type { WorkspaceAccessRepository } from "../../domain/ports";

interface GrantIndividualAccessDeps {
  readonly workspaceAccessRepo: WorkspaceAccessRepository;
}

export class GrantIndividualAccessUseCase {
  constructor(private readonly deps: GrantIndividualAccessDeps) {}

  async execute(workspaceId: string, grant: WorkspaceGrant): Promise<CommandResult> {
    try {
      await this.deps.workspaceAccessRepo.grantIndividualAccess(workspaceId, grant);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_GRANT_FAILED",
        err instanceof Error ? err.message : "Failed to grant individual access",
      );
    }
  }
}
