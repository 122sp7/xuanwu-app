import { AuditEntry } from "../aggregates/AuditEntry";
import type { RecordAuditEntryInput } from "../aggregates/AuditEntry";
import { createAuditAction } from "../value-objects/AuditAction";
import { createAuditSeverity } from "../value-objects/AuditSeverity";
import { createActorId } from "../value-objects/ActorId";

/**
 * AuditRecordingService — Stateless domain service for recording audit entries.
 *
 * Validates inputs via value-object constructors and delegates to AuditEntry.record().
 * Critical-severity escalation is handled by the aggregate itself.
 */
export class AuditRecordingService {
	/**
	 * Record a new audit entry with full input validation.
	 *
	 * @throws ZodError if action, severity, or actorId is invalid
	 */
	record(id: string, input: RecordAuditEntryInput): AuditEntry {
		// Validate through branded value objects (throws on invalid input)
		createAuditAction(input.action);
		createAuditSeverity(input.severity);
		createActorId(input.actorId);

		return AuditEntry.record(id, input);
	}
}
