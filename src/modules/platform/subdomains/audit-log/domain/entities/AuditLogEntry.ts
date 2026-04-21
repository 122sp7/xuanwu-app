/**
 * AuditLogEntry — immutable record of a significant platform action.
 *
 * Owned by platform/audit-log subdomain.
 * Entries are append-only; no mutations are permitted after creation.
 */
import { v4 as uuid } from "uuid";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "publish"
  | "invite"
  | "access"
  | "export"
  | string;

export interface AuditLogEntrySnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly actorId: string;
  readonly action: AuditAction;
  /** e.g. "workspace", "knowledge_artifact", "member" */
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly occurredAtISO: string;
}

export interface RecordAuditEntryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Record<string, unknown>;
}

export class AuditLogEntry {
  private constructor(private readonly _props: AuditLogEntrySnapshot) {}

  static record(input: RecordAuditEntryInput): AuditLogEntry {
    return new AuditLogEntry({
      id: uuid(),
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata ? Object.freeze({ ...input.metadata }) : undefined,
      occurredAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(snapshot: AuditLogEntrySnapshot): AuditLogEntry {
    return new AuditLogEntry(snapshot);
  }

  get id(): string { return this._props.id; }
  get actorId(): string { return this._props.actorId; }
  get action(): AuditAction { return this._props.action; }
  get resourceType(): string { return this._props.resourceType; }
  get resourceId(): string { return this._props.resourceId; }
  get occurredAtISO(): string { return this._props.occurredAtISO; }

  getSnapshot(): Readonly<AuditLogEntrySnapshot> {
    return Object.freeze({ ...this._props });
  }
}
