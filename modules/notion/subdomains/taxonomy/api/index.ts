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
  TaxonomyRepository,
} from "../domain/repositories/TaxonomyRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  TaxonomyNodeCreatedEvent,
  TaxonomyNodeRemovedEvent,
} from "../domain/events/TaxonomyEvents";

// ── Application DTOs ──────────────────────────────────────────────────────────
export type {
  CreateTaxonomyNodeDto,
  TaxonomyNodeDto,
} from "../application/dto/TaxonomyDto";

// ── Use cases ─────────────────────────────────────────────────────────────────
export {
  CreateTaxonomyNodeUseCase,
  RemoveTaxonomyNodeUseCase,
  ListTaxonomyRootsUseCase,
  ListTaxonomyChildrenUseCase,
} from "../application/use-cases/TaxonomyUseCases";
