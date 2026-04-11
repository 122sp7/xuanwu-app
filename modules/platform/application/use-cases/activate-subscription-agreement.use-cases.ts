/**
 * activate-subscription-agreement — use case.
 *
 * Command:  ActivateSubscriptionAgreement
 * Purpose:  Activates, renews, or suspends a subscription agreement.
 */

import type { PlatformCommandResult, ActivateSubscriptionAgreementInput } from "../dtos";
import type { SubscriptionAgreementRepository, PlatformContextRepository, DomainEventPublisher } from "../../domain/ports/output";
import { SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class ActivateSubscriptionAgreementUseCase {
	constructor(
		private readonly agreementRepo: SubscriptionAgreementRepository,
		private readonly contextRepo: PlatformContextRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: ActivateSubscriptionAgreementInput): Promise<PlatformCommandResult> {
		try {
			const context = await this.contextRepo.findById(input.contextId);
			if (!context) {
				return { ok: false, code: "PLATFORM_CONTEXT_NOT_FOUND", message: `Context '${input.contextId}' not found.` };
			}
			const existing = await this.agreementRepo.findEffectiveByContextId(input.contextId);
			const now = new Date().toISOString();
			const agreementSnapshot = {
				...(existing as Record<string, unknown> ?? {}),
				subscriptionAgreementId: input.subscriptionAgreementId,
				contextId: input.contextId,
				planCode: input.planCode,
				billingState: "active",
				updatedAt: now,
			};
			await this.agreementRepo.save(agreementSnapshot);
			const contextSnapshot = {
				...(context as Record<string, unknown>),
				subscriptionAgreementId: input.subscriptionAgreementId,
				updatedAt: now,
			};
			await this.contextRepo.save(contextSnapshot);
			await this.eventPublisher.publish([
				{
					type: SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE,
					aggregateType: "SubscriptionAgreement",
					aggregateId: input.subscriptionAgreementId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { subscriptionAgreementId: input.subscriptionAgreementId, planCode: input.planCode },
				},
			]);
			return {
				ok: true,
				code: "SUBSCRIPTION_AGREEMENT_ACTIVATED",
				metadata: { subscriptionAgreementId: input.subscriptionAgreementId, planCode: input.planCode },
			};
		} catch (err) {
			return {
				ok: false,
				code: "ACTIVATE_SUBSCRIPTION_AGREEMENT_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
