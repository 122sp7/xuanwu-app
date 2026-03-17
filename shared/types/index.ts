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
