import type { EntitlementGrantSnapshot } from '../../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

export class FirestoreEntitlementGrantRepository implements EntitlementGrantRepository {
  private readonly collection = 'entitlement_grants';

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: string): Promise<EntitlementGrantSnapshot | null> {
    const doc = await this.db.get(this.collection, id);
    if (!doc) return null;
    return doc as unknown as EntitlementGrantSnapshot;
  }

  async findByContextId(_contextId: string): Promise<EntitlementGrantSnapshot[]> {
    throw new Error('not yet implemented');
  }

  async findActiveByContextAndFeature(
    _contextId: string,
    _featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null> {
    throw new Error('not yet implemented');
  }

  async save(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await this.db.set(this.collection, snapshot.id, snapshot as unknown as Record<string, unknown>);
  }

  async update(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await this.db.set(this.collection, snapshot.id, snapshot as unknown as Record<string, unknown>);
  }
}
