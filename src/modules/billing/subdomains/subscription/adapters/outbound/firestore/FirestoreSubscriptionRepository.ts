import type { SubscriptionSnapshot } from '../../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

export class FirestoreSubscriptionRepository implements SubscriptionRepository {
  private readonly collection = 'subscriptions';

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: string): Promise<SubscriptionSnapshot | null> {
    const doc = await this.db.get(this.collection, id);
    if (!doc) return null;
    return doc as unknown as SubscriptionSnapshot;
  }

  async findActiveByContextId(_contextId: string): Promise<SubscriptionSnapshot | null> {
    throw new Error('not yet implemented');
  }

  async findByContextId(_contextId: string): Promise<SubscriptionSnapshot[]> {
    throw new Error('not yet implemented');
  }

  async save(snapshot: SubscriptionSnapshot): Promise<void> {
    await this.db.set(this.collection, snapshot.id, snapshot as unknown as Record<string, unknown>);
  }

  async update(snapshot: SubscriptionSnapshot): Promise<void> {
    await this.db.set(this.collection, snapshot.id, snapshot as unknown as Record<string, unknown>);
  }
}
