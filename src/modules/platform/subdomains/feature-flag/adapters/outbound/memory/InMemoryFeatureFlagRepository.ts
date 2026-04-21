import type { FeatureFlagSnapshot, FlagScope } from "../../../domain/entities/FeatureFlag";
import type { FeatureFlagRepository, FeatureFlagQuery } from "../../../domain/repositories/FeatureFlagRepository";

export class InMemoryFeatureFlagRepository implements FeatureFlagRepository {
  private readonly store = new Map<string, FeatureFlagSnapshot>();

  async save(snapshot: FeatureFlagSnapshot): Promise<void> {
    this.store.set(snapshot.key, snapshot);
  }

  async findByKey(key: string): Promise<FeatureFlagSnapshot | null> {
    return this.store.get(key) ?? null;
  }

  async query(params: FeatureFlagQuery): Promise<FeatureFlagSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.key) results = results.filter((f) => f.key === params.key);
    if (params.scope) results = results.filter((f) => f.scope === (params.scope as FlagScope));
    if (params.organizationId) results = results.filter((f) => f.organizationId === params.organizationId);
    if (params.workspaceId) results = results.filter((f) => f.workspaceId === params.workspaceId);
    if (params.actorId) results = results.filter((f) => f.actorId === params.actorId);
    if (params.enabledOnly) results = results.filter((f) => f.enabled);
    return results;
  }

  async delete(id: string): Promise<void> {
    for (const [key, flag] of this.store.entries()) {
      if (flag.id === id) { this.store.delete(key); return; }
    }
  }
}
