/**
 * publish-policy-catalog — use case.
 *
 * Command:  PublishPolicyCatalog
 * Purpose:  Publishes a new PolicyCatalog revision.
 */

import type { PlatformCommandResult, PublishPolicyCatalogInput } from "../dtos";
import type { PolicyCatalogRepository, DomainEventPublisher } from "../../domain/ports/output";
import { POLICY_CATALOG_PUBLISHED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class PublishPolicyCatalogUseCase {
	constructor(
		private readonly catalogRepo: PolicyCatalogRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: PublishPolicyCatalogInput): Promise<PlatformCommandResult> {
		try {
			const existing = await this.catalogRepo.findActiveByContextId(input.contextId);
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown> ?? {}),
				contextId: input.contextId,
				revision: input.revision,
				permissionRuleCount: (existing as Record<string, unknown> | null)?.permissionRuleCount ?? 0,
				workflowRuleCount: (existing as Record<string, unknown> | null)?.workflowRuleCount ?? 0,
				notificationRuleCount: (existing as Record<string, unknown> | null)?.notificationRuleCount ?? 0,
				auditRuleCount: (existing as Record<string, unknown> | null)?.auditRuleCount ?? 0,
				publishedAt: now,
			};
			await this.catalogRepo.saveRevision(snapshot);
			await this.eventPublisher.publish([
				{
					type: POLICY_CATALOG_PUBLISHED_EVENT_TYPE,
					aggregateType: "PolicyCatalog",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: input.revision,
					correlationId: buildCorrelationId(),
					payload: { revision: input.revision, publishedAt: now },
				},
			]);
			return {
				ok: true,
				code: "POLICY_CATALOG_PUBLISHED",
				metadata: { contextId: input.contextId, revision: input.revision },
			};
		} catch (err) {
			return {
				ok: false,
				code: "PUBLISH_POLICY_CATALOG_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
