/**
 * Module: wiki-core
 * Layer: domain/entity
 * Purpose: Canonical wiki document entity — source of truth for page content and lifecycle.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type WikiDocumentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export class WikiDocument {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: WikiDocumentStatus,
    public readonly createdAt: Date,
  ) {}

  publish(): void {
    this.status = 'PUBLISHED'
  }

  archive(): void {
    this.status = 'ARCHIVED'
  }
}
