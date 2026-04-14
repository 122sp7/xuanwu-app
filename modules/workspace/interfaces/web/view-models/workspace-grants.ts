import type { WorkspaceGrant } from "../../contracts";

export function describeGrant(grant: WorkspaceGrant): string {
  if (grant.teamId) {
    return "Team grant";
  }

  if (grant.userId) {
    return "User grant";
  }

  return "Unscoped grant";
}