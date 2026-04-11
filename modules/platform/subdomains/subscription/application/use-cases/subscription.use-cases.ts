/**
 * Subscription Use Cases — pure application logic.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Subscription } from "../../domain/aggregates/Subscription";
import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import type { BillingCycle } from "../../domain/value-objects/BillingCycle";

// ─── Activate Subscription ────────────────────────────────────────────────────

export class ActivateSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const sub = Subscription.create(id, input);
      await this.repo.save(sub.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ACTIVATE_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to activate subscription",
      );
    }
  }
}

// ─── Cancel Subscription ──────────────────────────────────────────────────────

export class CancelSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.cancel();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CANCEL_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to cancel subscription",
      );
    }
  }
}

// ─── Renew Subscription ───────────────────────────────────────────────────────

export class RenewSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.renew(newPeriodEnd);
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RENEW_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to renew subscription",
      );
    }
  }
}

// ─── Get Active Subscription (query-style) ───────────────────────────────────

export class GetActiveSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(contextId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findActiveByContextId(contextId);
      return commandSuccess(snapshot, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "GET_ACTIVE_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to get active subscription",
      );
    }
  }
}

// ─── Mark Past Due ────────────────────────────────────────────────────────────

export class MarkSubscriptionPastDueUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.markPastDue();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "MARK_PAST_DUE_FAILED",
        err instanceof Error ? err.message : "Failed to mark subscription past due",
      );
    }
  }
}
