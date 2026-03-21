/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for wiki document repository — local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument, IWikiDocumentRepository } from '@wiki-core'

export class InMemoryWikiDocumentRepository implements IWikiDocumentRepository {
  private readonly store = new Map<string, WikiDocument>()

  async save(entity: WikiDocument): Promise<void> {
    this.store.set(entity.id, entity)
  }

  async findById(id: string): Promise<WikiDocument | null> {
    return this.store.get(id) ?? null
  }

  async findByOrganization(organizationId: string): Promise<WikiDocument[]> {
    return [...this.store.values()].filter((doc) => doc.organizationId === organizationId)
  }

  async findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiDocument[]> {
    return [...this.store.values()].filter(
      (doc) => doc.organizationId === organizationId && doc.workspaceId === workspaceId,
    )
  }

  async search(_vector: number[]): Promise<WikiDocument[]> {
    return [...this.store.values()]
  }

  /** Clears all stored documents — useful for test isolation. */
  clear(): void {
    this.store.clear()
  }
}
