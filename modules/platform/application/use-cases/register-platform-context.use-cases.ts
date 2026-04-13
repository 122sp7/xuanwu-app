/**
 * register-platform-context — use case.
 *
 * Command:  RegisterPlatformContext
 * Purpose:  Creates a PlatformContext or re-activates a platform scope.
 */

import type { PlatformCommandResult, RegisterPlatformContextInput } from "../dto";
import type { PlatformContextRepository, DomainEventPublisher } from "../../domain/ports/output";
import { PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RegisterPlatformContextUseCase {
	constructor(
		private readonly contextRepo: PlatformContextRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RegisterPlatformContextInput): Promise<PlatformCommandResult> {
		try {
			const existing = await this.contextRepo.findById(input.contextId);
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown> ?? {}),
				contextId: input.contextId,
				subjectScope: input.subjectScope,
				lifecycleState: "active",
				capabilityKeys: (existing as Record<string, unknown> | null)?.capabilityKeys ?? [],
				updatedAt: now,
			};
			await this.contextRepo.save(snapshot);
			await this.eventPublisher.publish([
				{
					type: PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE,
					aggregateType: "PlatformContext",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { subjectScope: input.subjectScope, lifecycleState: "active" },
				},
			]);
			return { ok: true, code: "PLATFORM_CONTEXT_REGISTERED", metadata: { contextId: input.contextId } };
		} catch (err) {
			return {
				ok: false,
				code: "REGISTER_PLATFORM_CONTEXT_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
