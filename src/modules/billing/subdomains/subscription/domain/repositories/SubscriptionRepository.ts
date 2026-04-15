import type { SubscriptionSnapshot } from '../entities/Subscription';

export interface SubscriptionRepository {
  findById(id: string): Promise<SubscriptionSnapshot | null>;
  findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
  findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
  save(snapshot: SubscriptionSnapshot): Promise<void>;
  update(snapshot: SubscriptionSnapshot): Promise<void>;
}
