/**
 * IngestionJob — aggregate entity tracking a document through the RAG
 * ingestion pipeline.
 *
 * The embedded state machine enforces strict one-way status transitions,
 * keeping invalid states impossible at the domain level.
 *
 * Lifecycle (happy path):
 *   uploaded → parsing → chunking → embedding → indexed
 *
 * Repair paths:
 *   indexed  → stale → re-indexing → parsing
 *   failed   → re-indexing → parsing
 */

import type { IngestionDocument } from "./IngestionDocument";

// ── Status ────────────────────────────────────────────────────────────────────

export type IngestionStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";

const ALLOWED_TRANSITIONS: Readonly<Record<IngestionStatus, readonly IngestionStatus[]>> = {
  uploaded:      ["parsing",    "failed"],
  parsing:       ["chunking",   "failed"],
  chunking:      ["embedding",  "failed"],
  embedding:     ["indexed",    "failed"],
  indexed:       ["stale",      "re-indexing"],
  stale:         ["re-indexing"],
  "re-indexing": ["parsing",    "failed"],
  failed:        ["re-indexing"],
};

/**
 * Domain guard: returns true only when the requested transition is permitted
 * by the state machine contract.
 */
export function canTransitionIngestionStatus(
  from: IngestionStatus,
  to: IngestionStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface IngestionJob {
  /** Unique job identifier (UUID). */
  readonly id: string;
  /** Immutable document snapshot attached to this job. */
  readonly document: IngestionDocument;
  /** Current pipeline stage. */
  readonly status: IngestionStatus;
  /** Optional human-readable message describing the current stage or failure reason. */
  readonly statusMessage?: string;
  /** ISO-8601 timestamp of job creation. */
  readonly createdAtISO: string;
  /** ISO-8601 timestamp of last status update. */
  readonly updatedAtISO: string;
}
