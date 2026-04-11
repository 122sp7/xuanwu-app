/**
 * SubscriptionService — Composition root for subscription use cases.
 */
import {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
  GetActiveSubscriptionUseCase,
  MarkSubscriptionPastDueUseCase,
} from "../application/use-cases/subscription.use-cases";
import { FirebaseSubscriptionRepository } from "./firebase/FirebaseSubscriptionRepository";
import type { BillingCycle } from "../domain/value-objects/BillingCycle";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseSubscriptionRepository | undefined;

function getRepo(): FirebaseSubscriptionRepository {
  if (!_repo) _repo = new FirebaseSubscriptionRepository();
  return _repo;
}

export const subscriptionService = {
  activateSubscription: (input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> => new ActivateSubscriptionUseCase(getRepo()).execute(input),

  cancelSubscription: (subscriptionId: string): Promise<CommandResult> =>
    new CancelSubscriptionUseCase(getRepo()).execute(subscriptionId),

  renewSubscription: (subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> =>
    new RenewSubscriptionUseCase(getRepo()).execute(subscriptionId, newPeriodEnd),

  getActiveSubscription: (contextId: string): Promise<CommandResult> =>
    new GetActiveSubscriptionUseCase(getRepo()).execute(contextId),

  markPastDue: (subscriptionId: string): Promise<CommandResult> =>
    new MarkSubscriptionPastDueUseCase(getRepo()).execute(subscriptionId),
};
