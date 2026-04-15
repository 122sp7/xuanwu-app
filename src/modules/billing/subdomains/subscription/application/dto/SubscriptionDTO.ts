import type { SubscriptionSnapshot } from '../../domain/entities/Subscription';

export type SubscriptionView = Readonly<SubscriptionSnapshot>;

export interface SubscriptionSummary {
  readonly contextId: string;
  readonly planCode: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly currentPeriodEnd: string | null;
}
