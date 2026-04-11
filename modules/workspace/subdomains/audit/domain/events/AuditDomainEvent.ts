export interface AuditDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface AuditEntryRecordedEvent extends AuditDomainEvent {
	readonly type: "workspace.audit.entry_recorded";
	readonly payload: {
		readonly auditId: string;
		readonly workspaceId: string;
		readonly actorId: string;
		readonly action: string;
		readonly resourceType: string;
		readonly resourceId: string;
		readonly severity: string;
	};
}

export interface CriticalAuditDetectedEvent extends AuditDomainEvent {
	readonly type: "workspace.audit.critical_detected";
	readonly payload: {
		readonly auditId: string;
		readonly workspaceId: string;
		readonly actorId: string;
		readonly action: string;
		readonly resourceType: string;
	};
}

export type AuditDomainEventType = AuditEntryRecordedEvent | CriticalAuditDetectedEvent;
