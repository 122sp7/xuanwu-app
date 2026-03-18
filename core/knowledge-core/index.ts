/**
 * Module: knowledge-core
 * Layer: facade
 * Purpose: Integration facade that re-exports module contracts and local scaffolds.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// Canonical runtime module exports can be re-enabled when module aliases are available.
// export * from '@/modules/knowledge'
// export * from '@/modules/taxonomy'
// export * from '@/modules/retrieval'

// Local scaffold exports for guided implementation in core/knowledge-core.
export * from './domain/entities/knowledge.entity'
export * from './application/use-cases/create-knowledge'
