/**
 * Module: workspace
 * Layer: application/queries
 * Purpose: Workspace member read query — pure read with no business logic.
 *
 * DDD Rule 5:  Pure reads → Query, not Use Case.
 * DDD Rule 16: FetchXxxUseCase → should be Query.
 */

import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMemberView";
import type { WorkspaceQueryRepository } from "../../domain/ports/output/WorkspaceQueryRepository";

export function fetchWorkspaceMembers(
  workspaceQueryRepo: WorkspaceQueryRepository,
  workspaceId: string,
): Promise<WorkspaceMemberView[]> {
  return workspaceQueryRepo.getWorkspaceMembers(workspaceId);
}
