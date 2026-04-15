import type { ResourceQuotaSnapshot } from "../entities/ResourceQuota";
import type { ResourceKind } from "../entities/ResourceQuota";

export interface ResourceQuotaRepository {
  findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>;
  save(quota: ResourceQuotaSnapshot): Promise<void>;
  updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>;
}
