import type { ResourceQuotaRepository } from "../../../domain/repositories/ResourceQuotaRepository";
import type { ResourceQuotaSnapshot, ResourceKind } from "../../../domain/entities/ResourceQuota";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreQuotaRepository implements ResourceQuotaRepository {
  private readonly collection = "resource_quotas";

  constructor(private readonly db: FirestoreLike) {}

  async findById(quotaId: string): Promise<ResourceQuotaSnapshot | null> {
    const doc = await this.db.get(this.collection, quotaId);
    return doc ? (doc as unknown as ResourceQuotaSnapshot) : null;
  }

  async findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
      { field: "resourceKind", op: "==", value: resourceKind },
    ]);
    return docs.length > 0 ? (docs[0] as unknown as ResourceQuotaSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as ResourceQuotaSnapshot[];
  }

  async save(quota: ResourceQuotaSnapshot): Promise<void> {
    await this.db.set(this.collection, quota.id, quota as unknown as Record<string, unknown>);
  }

  async updateUsage(quotaId: string, current: number, nowISO: string): Promise<void> {
    const existing = await this.db.get(this.collection, quotaId);
    if (existing) {
      await this.db.set(this.collection, quotaId, { ...existing, current, updatedAtISO: nowISO });
    }
  }
}
