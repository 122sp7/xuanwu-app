/**
 * Module: namespace
 * Layer: domain/port
 * Purpose: Persistence and lookup contract for namespace records.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Namespace, NamespaceKind } from '../entities/namespace.entity'

export interface INamespaceRepository {
  save(namespace: Namespace): Promise<void>
  findById(id: string): Promise<Namespace | null>
  findBySlug(slug: string, kind: NamespaceKind): Promise<Namespace | null>
  findByOrganization(organizationId: string): Promise<Namespace[]>
  existsBySlug(slug: string, kind: NamespaceKind): Promise<boolean>
}
