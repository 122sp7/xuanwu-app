import { v4 as uuid } from "@lib-uuid";
import type { AuditAction } from "../value-objects/AuditAction";
import type { AuditSeverity } from "../value-objects/AuditSeverity";
import type { AuditDomainEventType } from "../events/AuditDomainEvent";

export type AuditLogSource = "workspace" | "finance" | "notification" | "system";

export interface ChangeRecord {
  readonly field: string;
  readonly oldValue: unknown;
  readonly newValue: unknown;
}

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
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly severity: AuditSeverity;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly changes?: readonly ChangeRecord[];
}

export class AuditEntry {
  private readonly _domainEvents: AuditDomainEventType[] = [];

  private constructor(private readonly _props: AuditEntrySnapshot) {}

  static record(id: string, input: RecordAuditEntryInput): AuditEntry {
    const now = new Date().toISOString();
    const entry = new AuditEntry({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      severity: input.severity,
      detail: input.detail,
      source: input.source,
      changes: input.changes ?? [],
      recordedAtISO: now,
    });
    entry._domainEvents.push({
      type: "workspace.audit.entry-recorded",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        auditId: id,
        workspaceId: input.workspaceId,
        actorId: input.actorId,
        action: input.action,
        severity: input.severity,
      },
    });
    return entry;
  }

  static reconstitute(snapshot: AuditEntrySnapshot): AuditEntry {
    return new AuditEntry({ ...snapshot });
  }

  isCritical(): boolean {
    return (this._props.severity as string) === "critical";
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get actorId(): string { return this._props.actorId; }
  get action(): AuditAction { return this._props.action; }
  get severity(): AuditSeverity { return this._props.severity; }
  get recordedAtISO(): string { return this._props.recordedAtISO; }

  getSnapshot(): Readonly<AuditEntrySnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AuditDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
