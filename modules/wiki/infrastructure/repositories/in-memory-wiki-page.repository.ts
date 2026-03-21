/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for wiki page repository — local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiPage, WikiPageScope, IWikiPageRepository } from '@wiki-core'

export class InMemoryWikiPageRepository implements IWikiPageRepository {
  private readonly store = new Map<string, WikiPage>()

  async save(page: WikiPage): Promise<void> {
    this.store.set(page.pageId, page)
  }

  async findById(pageId: string): Promise<WikiPage | null> {
    return this.store.get(pageId) ?? null
  }

  async findByOrganization(organizationId: string, scope?: WikiPageScope): Promise<WikiPage[]> {
    return [...this.store.values()].filter(
      (p) =>
        p.organizationId === organizationId &&
        !p.isArchived &&
        (scope === undefined || p.scope === scope),
    )
  }

  async findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiPage[]> {
    return [...this.store.values()].filter(
      (p) =>
        p.organizationId === organizationId && p.workspaceId === workspaceId && !p.isArchived,
    )
  }

  async findChildren(parentPageId: string): Promise<WikiPage[]> {
    return [...this.store.values()].filter((p) => p.parentPageId === parentPageId && !p.isArchived)
  }

  async findArchived(organizationId: string): Promise<WikiPage[]> {
    return [...this.store.values()].filter(
      (p) => p.organizationId === organizationId && p.isArchived,
    )
  }

  async delete(pageId: string): Promise<void> {
    this.store.delete(pageId)
  }

  /** Clears all stored pages — useful for test isolation. */
  clear(): void {
    this.store.clear()
  }
}
