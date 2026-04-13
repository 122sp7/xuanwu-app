/**
 * apply-configuration-profile — use case.
 *
 * Command:  ApplyConfigurationProfile
 * Purpose:  Applies a configuration profile and updates capability toggles.
 */

import type { PlatformCommandResult, ApplyConfigurationProfileInput } from "../dto";
import type { PlatformContextRepository, ConfigurationProfileStore, DomainEventPublisher } from "../../domain/ports/output";
import { CONFIG_PROFILE_APPLIED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class ApplyConfigurationProfileUseCase {
	constructor(
		private readonly contextRepo: PlatformContextRepository,
		private readonly profileStore: ConfigurationProfileStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: ApplyConfigurationProfileInput): Promise<PlatformCommandResult> {
		try {
			const profile = await this.profileStore.getProfile(input.profileRef);
			if (!profile) {
				return { ok: false, code: "CONFIGURATION_PROFILE_NOT_FOUND", message: `Profile '${input.profileRef}' not found.` };
			}
			const existing = await this.contextRepo.findById(input.contextId);
			if (!existing) {
				return { ok: false, code: "PLATFORM_CONTEXT_NOT_FOUND", message: `Context '${input.contextId}' not found.` };
			}
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown>),
				configurationProfileRef: input.profileRef,
				updatedAt: now,
			};
			await this.contextRepo.save(snapshot);
			await this.eventPublisher.publish([
				{
					type: CONFIG_PROFILE_APPLIED_EVENT_TYPE,
					aggregateType: "PlatformContext",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { profileRef: input.profileRef },
				},
			]);
			return {
				ok: true,
				code: "CONFIGURATION_PROFILE_APPLIED",
				metadata: { contextId: input.contextId, profileRef: input.profileRef },
			};
		} catch (err) {
			return {
				ok: false,
				code: "APPLY_CONFIGURATION_PROFILE_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
