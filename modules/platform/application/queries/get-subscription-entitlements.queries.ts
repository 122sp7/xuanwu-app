/**
 * get-subscription-entitlements — use case.
 *
 * Query:   GetSubscriptionEntitlements
 * Purpose: Returns plan entitlements and usage limits.
 */

import type { GetSubscriptionEntitlementsInput } from "../dtos";
import type { UsageMeterRepository, SubscriptionEntitlementsView } from "../../domain/ports/output";

export class GetSubscriptionEntitlementsUseCase {
	constructor(private readonly usageRepo: UsageMeterRepository) {}

	async execute(input: GetSubscriptionEntitlementsInput): Promise<SubscriptionEntitlementsView | null> {
		return this.usageRepo.getEntitlementsView(input.contextId);
	}
}
