import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { Subscription } from '../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../domain/value-objects/BillingCycle';

export class ActivateSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> {
    try {
      const id = uuid();
      const sub = Subscription.create(id, input);
      await this.repo.save(sub.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'ACTIVATE_SUBSCRIPTION_FAILED',
        err instanceof Error ? err.message : 'Failed to activate subscription',
      );
    }
  }
}

export class CancelSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom('SUBSCRIPTION_NOT_FOUND', `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.cancel();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'CANCEL_SUBSCRIPTION_FAILED',
        err instanceof Error ? err.message : 'Failed to cancel subscription',
      );
    }
  }
}

export class RenewSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom('SUBSCRIPTION_NOT_FOUND', `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.renew(newPeriodEnd);
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'RENEW_SUBSCRIPTION_FAILED',
        err instanceof Error ? err.message : 'Failed to renew subscription',
      );
    }
  }
}

export class GetActiveSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(contextId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findActiveByContextId(contextId);
      return commandSuccess(JSON.stringify(snapshot), Date.now());
    } catch (err) {
      return commandFailureFrom(
        'GET_ACTIVE_SUBSCRIPTION_FAILED',
        err instanceof Error ? err.message : 'Failed to get active subscription',
      );
    }
  }
}

export class MarkSubscriptionPastDueUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom('SUBSCRIPTION_NOT_FOUND', `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.markPastDue();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        'MARK_PAST_DUE_FAILED',
        err instanceof Error ? err.message : 'Failed to mark subscription past due',
      );
    }
  }
}
