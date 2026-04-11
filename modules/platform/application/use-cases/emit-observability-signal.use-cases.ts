/**
 * emit-observability-signal — use case.
 *
 * Command:  EmitObservabilitySignal
 * Purpose:  Emits metrics / trace / alert signals.
 */

import type { PlatformCommandResult, EmitObservabilitySignalInput } from "../dtos";
import type { ObservabilitySink, AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

const AUDIT_SIGNAL_LEVELS = new Set(["error", "critical", "fatal"]);

export class EmitObservabilitySignalUseCase {
	constructor(
		private readonly observabilitySink: ObservabilitySink,
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: EmitObservabilitySignalInput): Promise<PlatformCommandResult> {
		try {
			const now = new Date().toISOString();
			await this.observabilitySink.emit({
				signalName: input.signalName,
				signalLevel: input.signalLevel,
				sourceRef: input.sourceRef,
				contextId: input.contextId,
				occurredAt: now,
			});
			if (AUDIT_SIGNAL_LEVELS.has(input.signalLevel.toLowerCase())) {
				await this.auditStore.write({
					signalType: "observability.signal_emitted",
					severity: input.signalLevel,
					contextId: input.contextId,
					signalName: input.signalName,
					occurredAt: now,
				});
			}
			await this.eventPublisher.publish([
				{
					type: OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE,
					aggregateType: "Observability",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { signalName: input.signalName, signalLevel: input.signalLevel, sourceRef: input.sourceRef },
				},
			]);
			return {
				ok: true,
				code: "OBSERVABILITY_SIGNAL_EMITTED",
				metadata: { signalName: input.signalName, signalLevel: input.signalLevel },
			};
		} catch (err) {
			return {
				ok: false,
				code: "EMIT_OBSERVABILITY_SIGNAL_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
