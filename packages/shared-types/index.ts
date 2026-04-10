import { z } from "@lib-zod";

// ─── Domain Event base interface ─────────────────────────────────────────────

/** All domain events must implement this interface. */
export interface DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Event type discriminant (e.g. "workspace.created") */
  readonly type: string;
  /** Aggregate root ID that triggered the event */
  readonly aggregateId: string;
  /** ISO 8601 occurrence timestamp */
  readonly occurredAt: string;
}

// ─── Base entity schema ───────────────────────────────────────────────────────

const CreatedBySchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
});

/**
 * Shared base fields for all domain entities.
 * Includes tenant isolation (accountId / workspaceId) and audit trail (createdBy).
 */
export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  workspaceId: z.string(),
  accountId: z.string(),
  createdBy: CreatedBySchema,
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type CreatedBy = z.infer<typeof CreatedBySchema>;

/**
 * Query scope for account-level or workspace-level queries.
 * When workspaceId is omitted, the query spans all workspaces for the tenant.
 */
export interface QueryScope {
  accountId: string;
  workspaceId?: string;
}

// ─── Primitive types ──────────────────────────────────────────────────────────

export type ID = string;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Domain Error ─────────────────────────────────────────────────────────────

/**
 * Structured domain error returned in CommandFailure.
 * Consumers MUST NOT use raw Error objects for command results.
 */
export interface DomainError {
  readonly code: string;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}

// ─── Command Result Contract [R4] ─────────────────────────────────────────────

export interface CommandSuccess {
  readonly success: true;
  readonly aggregateId: string;
  readonly version: number;
}

export interface CommandFailure {
  readonly success: false;
  readonly error: DomainError;
}

/** Union returned by every Command Handler / use-case / _actions.ts export. */
export type CommandResult = CommandSuccess | CommandFailure;

export function commandSuccess(aggregateId: string, version: number): CommandSuccess {
  return { success: true, aggregateId, version };
}

export function commandFailure(error: DomainError): CommandFailure {
  return { success: false, error };
}

export function commandFailureFrom(
  code: string,
  message: string,
  context?: Record<string, unknown>,
): CommandFailure {
  return commandFailure({ code, message, context });
}

// ─── Firestore Timestamp shim ─────────────────────────────────────────────────

/** Opaque Firestore Timestamp — Domain only carries seconds/nanoseconds, no SDK types. */
export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
}
