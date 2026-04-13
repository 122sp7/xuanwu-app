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
  RelationRepository,
} from "../domain/repositories/RelationRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  RelationCreatedEvent,
  RelationRemovedEvent,
} from "../domain/events/RelationEvents";

// ── Application DTOs ──────────────────────────────────────────────────────────
export type {
  CreateRelationDto,
  RelationDto,
} from "../application/dto/RelationDto";

// ── Application contracts ─────────────────────────────────────────────────────
export * from "../application";

// Note: server-only composition and infrastructure adapters are exported from
// `./server` to keep the default boundary runtime-safe.
