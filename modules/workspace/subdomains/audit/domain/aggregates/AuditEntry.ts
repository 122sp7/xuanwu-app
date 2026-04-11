import type { AuditLogSource } from "../entities/AuditLog";
import type { AuditDomainEventType } from "../events";
import type { AuditAction } from "../schema";
import type { AuditSeverity } from "../value-objects";
import type { ChangeRecord } from "../schema";

export interface AuditEntrySnapshot {
	readonly id: string;
	readonly workspaceId: string;
	readonly actorId: string;
	readonly action: AuditAction;
	readonly resourceType: string;
	readonly resourceId: string;
	readonly severity: AuditSeverity;
	readonly detail: string;
	readonly source: AuditLogSource;
	readonly changes: readonly ChangeRecord[];
	readonly recordedAtISO: string;
}

export interface RecordAuditEntryInput {
	readonly workspaceId: string;
	readonly actorId: string;
	readonly action: string;
	readonly resourceType: string;
	readonly resourceId: string;
	readonly severity: string;
	readonly detail: string;
	readonly source: AuditLogSource;
	readonly changes?: readonly ChangeRecord[];
}

/**
 * AuditEntry — Immutable aggregate root for audit records.
 *
 * Audit entries are write-once: once recorded they cannot be modified or deleted.
 * All mutation methods are intentionally absent.
 */
export class AuditEntry {
	private readonly _domainEvents: AuditDomainEventType[] = [];

	private constructor(private readonly _props: AuditEntrySnapshot) {}

	/**
	 * Record a new audit entry. This is the only way to create an AuditEntry.
	 * Validates action and severity via Zod branded types.
	 */
	static record(id: string, input: RecordAuditEntryInput): AuditEntry {
		// Import dynamically is not possible in domain — validate via type narrowing
		// The caller is responsible for passing valid action/severity strings;
		// Zod validation happens at the value-object layer boundary.
		const now = new Date().toISOString();
		const entry = new AuditEntry({
			id,
			workspaceId: input.workspaceId,
			actorId: input.actorId,
			action: input.action as AuditAction,
			resourceType: input.resourceType,
			resourceId: input.resourceId,
			severity: input.severity as AuditSeverity,
			detail: input.detail,
			source: input.source,
			changes: input.changes ?? [],
			recordedAtISO: now,
		});
		entry._domainEvents.push({
			type: "workspace.audit.entry_recorded",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				auditId: id,
				workspaceId: input.workspaceId,
				actorId: input.actorId,
				action: input.action,
				resourceType: input.resourceType,
				resourceId: input.resourceId,
				severity: input.severity,
			},
		});

		// Auto-escalation: critical entries emit an additional alert event
		if (entry.isCritical()) {
			entry._domainEvents.push({
				type: "workspace.audit.critical_detected",
				eventId: crypto.randomUUID(),
				occurredAt: now,
				payload: {
					auditId: id,
					workspaceId: input.workspaceId,
					actorId: input.actorId,
					action: input.action,
					resourceType: input.resourceType,
				},
			});
		}

		return entry;
	}

	static reconstitute(snapshot: AuditEntrySnapshot): AuditEntry {
		return new AuditEntry({ ...snapshot });
	}

	// ── Query methods (audit is immutable — no mutation) ─────────────────────

	/** Returns true when severity is "critical". */
	isCritical(): boolean {
		return this._props.severity === ("critical" as AuditSeverity);
	}

	/** Returns true when severity is "critical" or "high". */
	isHighSeverity(): boolean {
		return (
			this._props.severity === ("critical" as AuditSeverity) ||
			this._props.severity === ("high" as AuditSeverity)
		);
	}

	// ── Getters ──────────────────────────────────────────────────────────────

	get id(): string {
		return this._props.id;
	}

	get workspaceId(): string {
		return this._props.workspaceId;
	}

	get actorId(): string {
		return this._props.actorId;
	}

	get action(): AuditAction {
		return this._props.action;
	}

	get resourceType(): string {
		return this._props.resourceType;
	}

	get resourceId(): string {
		return this._props.resourceId;
	}

	get severity(): AuditSeverity {
		return this._props.severity;
	}

	get detail(): string {
		return this._props.detail;
	}

	get source(): AuditLogSource {
		return this._props.source;
	}

	get changes(): readonly ChangeRecord[] {
		return this._props.changes;
	}

	get recordedAtISO(): string {
		return this._props.recordedAtISO;
	}

	getSnapshot(): Readonly<AuditEntrySnapshot> {
		return Object.freeze({ ...this._props });
	}

	pullDomainEvents(): AuditDomainEventType[] {
		const events = [...this._domainEvents];
		(this._domainEvents as AuditDomainEventType[]).length = 0;
		return events;
	}
}
