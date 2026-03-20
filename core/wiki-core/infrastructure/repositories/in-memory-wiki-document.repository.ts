/**
 * Module: wiki-core
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for wiki document repository — local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'

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
    // In-memory adapter returns all documents; Upstash or Firestore adapter handles real vector search.
    return [...this.store.values()]
  }

  /** Clears all stored documents — useful for test isolation. */
  clear(): void {
    this.store.clear()
  }
}
