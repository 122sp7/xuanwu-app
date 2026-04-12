/**
 * Public API boundary for the relations subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  RelationDirection,
  Relation,
  CreateRelationInput,
} from "../domain/entities/Relation";

// ── Repository contracts ───────────────────────────────────────────────────────
export type {
  IRelationRepository,
} from "../domain/repositories/IRelationRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  RelationCreatedEvent,
  RelationRemovedEvent,
} from "../domain/events/RelationEvents";
