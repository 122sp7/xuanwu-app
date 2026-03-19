import type {
  OrganizationDailyDigestEntity,
  WorkspaceDailyDigestEntity,
} from "../entities/DailyDigest";

export interface DailyDigestRepository {
  getWorkspaceDigest(workspaceId: string, accountId: string): Promise<WorkspaceDailyDigestEntity>;
  getOrganizationDigest(
    organizationId: string,
    workspaceIds: string[],
  ): Promise<OrganizationDailyDigestEntity>;
}
