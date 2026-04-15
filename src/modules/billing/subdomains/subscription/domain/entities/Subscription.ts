import { v4 as uuid } from '@lib-uuid';
import type { SubscriptionDomainEventType } from '../events/SubscriptionDomainEvent';
import { createSubscriptionId } from '../value-objects/SubscriptionId';
import { canCancel, canRenew } from '../value-objects/SubscriptionStatus';
import type { SubscriptionStatus } from '../value-objects/SubscriptionStatus';
import type { BillingCycle } from '../value-objects/BillingCycle';

export interface SubscriptionSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly status: SubscriptionStatus;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string | null;
  readonly cancelledAt: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateSubscriptionInput {
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart?: string;
  readonly currentPeriodEnd?: string | null;
}

export class Subscription {
  private readonly _domainEvents: SubscriptionDomainEventType[] = [];

  private constructor(private _props: SubscriptionSnapshot) {}

  static create(id: string, input: CreateSubscriptionInput): Subscription {
    createSubscriptionId(id);
    const now = new Date().toISOString();
    const sub = new Subscription({
      id,
      contextId: input.contextId,
      planCode: input.planCode,
      billingCycle: input.billingCycle,
      status: 'active',
      currentPeriodStart: input.currentPeriodStart ?? now,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelledAt: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    sub._domainEvents.push({
      type: 'platform.subscription.activated',
      eventId: uuid(),
      occurredAt: now,
      payload: {
        subscriptionId: id,
        contextId: input.contextId,
        planCode: input.planCode,
        billingCycle: input.billingCycle,
      },
    });
    return sub;
  }

  static reconstitute(snapshot: SubscriptionSnapshot): Subscription {
    createSubscriptionId(snapshot.id);
    return new Subscription({ ...snapshot });
  }

  cancel(): void {
    if (!canCancel(this._props.status)) {
      throw new Error(`Subscription in status '${this._props.status}' cannot be cancelled.`);
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: 'cancelled', cancelledAt: now, updatedAtISO: now };
    this._domainEvents.push({
      type: 'platform.subscription.cancelled',
      eventId: uuid(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  renew(newPeriodEnd: string): void {
    if (!canRenew(this._props.status)) {
      throw new Error(`Subscription in status '${this._props.status}' cannot be renewed.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: newPeriodEnd,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: 'platform.subscription.renewed',
      eventId: uuid(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId, newPeriodEnd },
    });
  }

  markPastDue(): void {
    if (this._props.status !== 'active') {
      throw new Error('Only active subscription can be marked past due.');
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: 'past_due', updatedAtISO: now };
    this._domainEvents.push({
      type: 'platform.subscription.past_due',
      eventId: uuid(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  expire(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: 'expired', updatedAtISO: now };
    this._domainEvents.push({
      type: 'platform.subscription.expired',
      eventId: uuid(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  get id(): string { return this._props.id; }
  get contextId(): string { return this._props.contextId; }
  get planCode(): string { return this._props.planCode; }
  get billingCycle(): BillingCycle { return this._props.billingCycle; }
  get status(): SubscriptionStatus { return this._props.status; }
  get currentPeriodEnd(): string | null { return this._props.currentPeriodEnd; }
  get cancelledAt(): string | null { return this._props.cancelledAt; }
  get isActive(): boolean {
    return this._props.status === 'active' || this._props.status === 'trialing';
  }

  getSnapshot(): Readonly<SubscriptionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): SubscriptionDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
