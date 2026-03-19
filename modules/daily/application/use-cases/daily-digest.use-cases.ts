import type {
  OrganizationDailyDigestEntity,
  WorkspaceDailyDigestEntity,
} from "../../domain/entities/DailyDigest";
import type { DailyDigestRepository } from "../../domain/repositories/DailyDigestRepository";

export class GetWorkspaceDailyDigestUseCase {
  constructor(private readonly repository: DailyDigestRepository) {}

  execute(workspaceId: string, accountId: string): Promise<WorkspaceDailyDigestEntity> {
    return this.repository.getWorkspaceDigest(workspaceId, accountId);
  }
}

export class GetOrganizationDailyDigestUseCase {
  constructor(private readonly repository: DailyDigestRepository) {}

  execute(
    organizationId: string,
    workspaceIds: string[],
  ): Promise<OrganizationDailyDigestEntity> {
    return this.repository.getOrganizationDigest(organizationId, workspaceIds);
  }
}
