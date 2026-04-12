/**
 * Public API boundary for the taxonomy subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  TaxonomyNode,
  CreateTaxonomyNodeInput,
} from "../domain/entities/TaxonomyNode";

// ── Repository contracts ───────────────────────────────────────────────────────
export type {
  ITaxonomyRepository,
} from "../domain/repositories/ITaxonomyRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  TaxonomyNodeCreatedEvent,
  TaxonomyNodeRemovedEvent,
} from "../domain/events/TaxonomyEvents";
