/**
 * Lifecycle Subdomain — Delete Workspace Use Case
 *
 * Business intent: Remove a workspace container from the system.
 *
 * DDD Rule 1: Has business behavior (existence verification before deletion)
 * DDD Rule 2: Has flow (verify existence → delete → success/failure)
 * DDD Rule 8: One use case = one business intent (verb: Delete)
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../domain/ports";

interface DeleteWorkspaceDeps {
  readonly workspaceRepo: WorkspaceRepository;
}

export class DeleteWorkspaceUseCase {
  constructor(private readonly deps: DeleteWorkspaceDeps) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const workspace = await this.deps.workspaceRepo.findById(workspaceId);
      if (!workspace) {
        return commandFailureFrom("WORKSPACE_NOT_FOUND", `Workspace ${workspaceId} not found`);
      }

      await this.deps.workspaceRepo.delete(workspaceId);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORKSPACE_DELETE_FAILED",
        err instanceof Error ? err.message : "Failed to delete workspace",
      );
    }
  }
}
