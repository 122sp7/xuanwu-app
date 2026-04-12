/**
 * Public API boundary for the retrieval subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Migration Target (from ai subdomain)
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  RetrievedChunk,
  RetrievalSummary,
} from "../domain/entities/RetrievedChunk";

// ── Port contracts ────────────────────────────────────────────────────────────
export type {
  RetrieveChunksInput,
  IChunkRetrievalPort,
} from "../domain/ports/IChunkRetrievalPort";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  RetrievalCompletedEvent,
  RetrievalFailedEvent,
} from "../domain/events/RetrievalEvents";
