/**
 * DispatchOutcome — Shared Type
 *
 * Represents the normalised result of an external delivery attempt.
 * Abstracts protocol-specific responses (HTTP status, queue ACK, error codes)
 * into a single domain-visible outcome type.
 *
 * Values:
 *   success  — delivery confirmed by the external system
 *   failure  — external system rejected or did not acknowledge
 *   partial  — partial delivery (e.g., some batch items failed)
 *   unknown  — no response received within timeout
 *
 * Fields:
 *   outcome      — "success" | "failure" | "partial" | "unknown"
 *   failureCode  — optional protocol-level failure code
 *   attemptAt    — ISO 8601 timestamp of the delivery attempt
 *
 * @see adapters/external/mapExternalResponseToDispatchOutcome.ts
 * @see domain/entities/DispatchContextEntity.ts
 */

// TODO: implement DispatchOutcome discriminated union type
