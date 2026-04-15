export interface AuditDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface AuditEntryRecordedEvent extends AuditDomainEvent {
  readonly type: "workspace.audit.entry-recorded";
  readonly payload: {
    readonly auditId: string;
    readonly workspaceId: string;
    readonly actorId: string;
    readonly action: string;
    readonly severity: string;
  };
}

export type AuditDomainEventType = AuditEntryRecordedEvent;
