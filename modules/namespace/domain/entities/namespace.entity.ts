/**
 * Module: namespace-core
 * Layer: domain/entity
 * Purpose: Canonical namespace entity — named scope for multi-tenant resource addressing.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { NamespaceSlug } from '../value-objects/namespace-slug.vo'

export type NamespaceKind = 'organization' | 'workspace'

export type NamespaceStatus = 'active' | 'suspended' | 'archived'

export class Namespace {
  constructor(
    public readonly id: string,
    public readonly slug: NamespaceSlug,
    public readonly kind: NamespaceKind,
    public readonly ownerAccountId: string,
    public readonly organizationId: string,
    public status: NamespaceStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  suspend(): void {
    if (this.status !== 'active') {
      throw new Error(`Cannot suspend a namespace in status "${this.status}"`)
    }
    this.status = 'suspended'
    this.updatedAt = new Date()
  }

  restore(): void {
    if (this.status !== 'suspended') {
      throw new Error(`Cannot restore a namespace that is not suspended`)
    }
    this.status = 'active'
    this.updatedAt = new Date()
  }

  archive(): void {
    if (this.status === 'archived') {
      throw new Error('Namespace is already archived')
    }
    this.status = 'archived'
    this.updatedAt = new Date()
  }

  get isActive(): boolean {
    return this.status === 'active'
  }
}
