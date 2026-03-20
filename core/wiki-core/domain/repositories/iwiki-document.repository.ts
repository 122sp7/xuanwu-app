/**
 * Module: wiki-core
 * Layer: domain/port
 * Purpose: Repository contract for wiki document persistence and querying.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument } from '../entities/wiki-document.entity'

export interface IWikiDocumentRepository {
  save(entity: WikiDocument): Promise<void>
  findById(id: string): Promise<WikiDocument | null>
  findByOrganization(organizationId: string): Promise<WikiDocument[]>
  findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiDocument[]>
  search(vector: number[]): Promise<WikiDocument[]>
}
