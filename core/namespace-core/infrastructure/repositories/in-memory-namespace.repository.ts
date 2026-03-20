/**
 * Module: namespace-core
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for namespace repository — local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Namespace, NamespaceKind } from '../../domain/entities/namespace.entity'
import { INamespaceRepository } from '../../domain/repositories/inamespace.repository'

export class InMemoryNamespaceRepository implements INamespaceRepository {
  private readonly store = new Map<string, Namespace>()

  async save(namespace: Namespace): Promise<void> {
    this.store.set(namespace.id, namespace)
  }

  async findById(id: string): Promise<Namespace | null> {
    return this.store.get(id) ?? null
  }

  async findBySlug(slug: string, kind: NamespaceKind): Promise<Namespace | null> {
    for (const ns of this.store.values()) {
      if (ns.slug.value === slug && ns.kind === kind) {
        return ns
      }
    }
    return null
  }

  async findByOrganization(organizationId: string): Promise<Namespace[]> {
    return [...this.store.values()].filter((ns) => ns.organizationId === organizationId)
  }

  async existsBySlug(slug: string, kind: NamespaceKind): Promise<boolean> {
    for (const ns of this.store.values()) {
      if (ns.slug.value === slug && ns.kind === kind) {
        return true
      }
    }
    return false
  }
}
