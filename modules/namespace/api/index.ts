/**
 * Module: namespace
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Namespace domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export { Namespace } from "../domain/entities/namespace.entity";
export type { NamespaceKind, NamespaceStatus } from "../domain/entities/namespace.entity";

// ─── Value objects ────────────────────────────────────────────────────────────

export { NamespaceSlug } from "../domain/value-objects/namespace-slug.vo";

// ─── Domain services ─────────────────────────────────────────────────────────

export { deriveSlugCandidate, isValidSlug } from "../domain/services/slug-policy";
