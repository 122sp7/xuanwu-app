/**
 * Module: wiki
 * Layer: domain/entity
 * Purpose: Wiki page entity — navigable knowledge page with scope and hierarchical nesting.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type WikiPageScope = 'organization' | 'workspace' | 'private'

export type WikiPageStatus = 'draft' | 'published' | 'archived'

export class WikiPage {
  constructor(
    public readonly pageId: string,
    public readonly organizationId: string,
    public readonly workspaceId: string | null,
    public title: string,
    public content: string,
    public readonly scope: WikiPageScope,
    public status: WikiPageStatus,
    public readonly parentPageId: string | null,
    public readonly order: number,
    public isArchived: boolean,
    public readonly createdBy: string,
    public readonly createdAtISO: string,
    public updatedAtISO: string,
  ) {}

  publish(): void {
    if (this.status === 'archived') {
      throw new Error('Cannot publish an archived wiki page — restore it first')
    }
    this.status = 'published'
    this.updatedAtISO = new Date().toISOString()
  }

  archive(): void {
    this.isArchived = true
    this.status = 'archived'
    this.updatedAtISO = new Date().toISOString()
  }

  restore(): void {
    if (!this.isArchived) {
      throw new Error('Cannot restore a wiki page that is not archived')
    }
    this.isArchived = false
    this.status = 'draft'
    this.updatedAtISO = new Date().toISOString()
  }

  updateTitle(title: string): void {
    if (!title.trim()) {
      throw new Error('Wiki page title cannot be empty')
    }
    this.title = title.trim()
    this.updatedAtISO = new Date().toISOString()
  }

  updateContent(content: string): void {
    this.content = content
    this.updatedAtISO = new Date().toISOString()
  }

  get isPublished(): boolean {
    return this.status === 'published' && !this.isArchived
  }
}
