/**
 * record-audit-signal — use case.
 *
 * Command:  RecordAuditSignal
 * Purpose:  Writes a decision or behavior as an immutable audit signal.
 */

import type { PlatformCommandResult, RecordAuditSignalInput } from "../dtos";
import type { AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { AUDIT_SIGNAL_RECORDED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RecordAuditSignalUseCase {
	constructor(
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RecordAuditSignalInput): Promise<PlatformCommandResult> {
		try {
			const now = new Date().toISOString();
			await this.auditStore.write({
				signalType: input.signalType,
				severity: input.severity,
				contextId: input.contextId,
				occurredAt: now,
			});
			await this.eventPublisher.publish([
				{
					type: AUDIT_SIGNAL_RECORDED_EVENT_TYPE,
					aggregateType: "AuditLog",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { signalType: input.signalType, severity: input.severity },
				},
			]);
			return {
				ok: true,
				code: "AUDIT_SIGNAL_RECORDED",
				metadata: { signalType: input.signalType, contextId: input.contextId },
			};
		} catch (err) {
			return {
				ok: false,
				code: "RECORD_AUDIT_SIGNAL_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
