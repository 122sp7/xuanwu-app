/**
 * Module: namespace
 * Layer: infrastructure
 * Purpose: Barrel re-export for all namespace infrastructure adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export { InMemoryNamespaceRepository } from './repositories/in-memory-namespace.repository'
