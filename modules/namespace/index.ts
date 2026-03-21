/**
 * Module: namespace
 * Layer: facade
 * Purpose: Public API for the namespace module — namespace registration, resolution, and slug policy.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities ──────────────────────────────────────────────────────────
export { Namespace } from './domain/entities/namespace.entity'
export type { NamespaceKind, NamespaceStatus } from './domain/entities/namespace.entity'

// ── Domain: Repositories (ports) ─────────────────────────────────────────────
export type { INamespaceRepository } from './domain/repositories/inamespace.repository'

// ── Domain: Services ─────────────────────────────────────────────────────────
export { deriveSlugCandidate, isValidSlug } from './domain/services/slug-policy'

// ── Domain: Value Objects ────────────────────────────────────────────────────
export { NamespaceSlug } from './domain/value-objects/namespace-slug.vo'

// ── Application: Use Cases ────────────────────────────────────────────────────
export { RegisterNamespaceUseCase } from './application/use-cases/register-namespace.use-case'
export type { RegisterNamespaceDTO } from './application/use-cases/register-namespace.use-case'
export { ResolveNamespaceUseCase } from './application/use-cases/resolve-namespace.use-case'
export type { ResolveNamespaceDTO } from './application/use-cases/resolve-namespace.use-case'

// ── Infrastructure ────────────────────────────────────────────────────────────
export { InMemoryNamespaceRepository } from './infrastructure/repositories/in-memory-namespace.repository'

// ── Interfaces ────────────────────────────────────────────────────────────────
export { NamespaceController } from './interfaces/api/namespace.controller'
