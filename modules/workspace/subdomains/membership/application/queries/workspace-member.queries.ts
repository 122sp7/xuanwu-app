/**
 * Membership Subdomain — Workspace Member Query Handler
 *
 * Pure read query for workspace members — no business logic.
 * Delegates to workspace query repository for member resolution.
 *
 * DDD Rule 5:  Pure reads → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 */

import type { WorkspaceMemberView } from "../../domain";
import type { WorkspaceQueryRepository } from "../../domain/ports";

export function fetchWorkspaceMembers(
  workspaceQueryRepo: WorkspaceQueryRepository,
  workspaceId: string,
): Promise<WorkspaceMemberView[]> {
  return workspaceQueryRepo.getWorkspaceMembers(workspaceId);
}
