/**
 * Public API boundary for the grounding subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Migration Target (from ai subdomain)
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  Citation,
  GroundingEvidence,
} from "../domain/entities/GroundingEvidence";

// ── Domain service contracts ──────────────────────────────────────────────────
export type {
  CitationBuilderInput,
  ICitationBuilder,
} from "../domain/services/ICitationBuilder";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  GroundingCompletedEvent,
} from "../domain/events/GroundingEvents";
