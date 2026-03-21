/**
 * Module: wiki-core
 * Layer: infrastructure/repository
 * Purpose: Adapter implementing wiki document repository contract via Upstash services.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'

export class UpstashWikiDocumentRepository implements IWikiDocumentRepository {
  async save(_entity: WikiDocument): Promise<void> {
    // Skeleton only: persist source-of-truth data with adapter composition.
  }

  async findById(_id: string): Promise<WikiDocument | null> {
    // Skeleton only: hydrate domain entity from storage.
    return null
  }

  async findByOrganization(_organizationId: string): Promise<WikiDocument[]> {
    // Skeleton only: list documents scoped to an organization.
    return []
  }

  async findByWorkspace(_organizationId: string, _workspaceId: string): Promise<WikiDocument[]> {
    // Skeleton only: list documents scoped to a workspace.
    return []
  }

  async search(_vector: number[]): Promise<WikiDocument[]> {
    // Skeleton only: retrieval bridge should return ids then hydrate from source.
    return []
  }
}
