/**
 * Module: wiki
 * Layer: domain/entity
 * Purpose: Canonical wiki document entity — source of truth for knowledge document lifecycle and RAG pipeline.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { Taxonomy } from '../value-objects/taxonomy.vo'

export type WikiDocumentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type WikiDocumentScope = 'organization' | 'workspace' | 'private'

export class WikiDocument {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: WikiDocumentStatus,
    public readonly createdAt: Date,
    public readonly organizationId: string,
    public readonly workspaceId: string | null,
    public readonly taxonomy: Taxonomy,
    public scope: WikiDocumentScope,
    public parentPageId: string | null = null,
  ) {}

  publish(): void {
    this.status = 'PUBLISHED'
  }

  archive(): void {
    this.status = 'ARCHIVED'
  }
}
