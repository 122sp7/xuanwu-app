import type { WorkspaceGrant } from "../../aggregates/Workspace";

export interface WorkspaceAccessRepository {
  grantTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>;
  revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>;
}