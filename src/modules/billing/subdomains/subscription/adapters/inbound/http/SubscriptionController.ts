import type { CommandResult } from '../../../../../../shared';
import {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
  GetActiveSubscriptionUseCase,
  MarkSubscriptionPastDueUseCase,
} from '../../../application/use-cases/SubscriptionUseCases';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../../domain/value-objects/BillingCycle';

export class SubscriptionController {
  private readonly activateUseCase: ActivateSubscriptionUseCase;
  private readonly cancelUseCase: CancelSubscriptionUseCase;
  private readonly renewUseCase: RenewSubscriptionUseCase;
  private readonly getActiveUseCase: GetActiveSubscriptionUseCase;
  private readonly markPastDueUseCase: MarkSubscriptionPastDueUseCase;

  constructor(repo: SubscriptionRepository) {
    this.activateUseCase = new ActivateSubscriptionUseCase(repo);
    this.cancelUseCase = new CancelSubscriptionUseCase(repo);
    this.renewUseCase = new RenewSubscriptionUseCase(repo);
    this.getActiveUseCase = new GetActiveSubscriptionUseCase(repo);
    this.markPastDueUseCase = new MarkSubscriptionPastDueUseCase(repo);
  }

  async handleActivate(body: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> {
    return this.activateUseCase.execute(body);
  }

  async handleCancel(subscriptionId: string): Promise<CommandResult> {
    return this.cancelUseCase.execute(subscriptionId);
  }

  async handleRenew(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> {
    return this.renewUseCase.execute(subscriptionId, newPeriodEnd);
  }

  async handleGetActive(contextId: string): Promise<CommandResult> {
    return this.getActiveUseCase.execute(contextId);
  }

  async handleMarkPastDue(subscriptionId: string): Promise<CommandResult> {
    return this.markPastDueUseCase.execute(subscriptionId);
  }
}
