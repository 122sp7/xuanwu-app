/**
 * Module: wiki
 * Layer: domain/port
 * Purpose: Repository contract for wiki page persistence and hierarchical retrieval.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiPage, WikiPageScope } from '../entities/wiki-page.entity'

export interface IWikiPageRepository {
  save(page: WikiPage): Promise<void>
  findById(pageId: string): Promise<WikiPage | null>
  findByOrganization(organizationId: string, scope?: WikiPageScope): Promise<WikiPage[]>
  findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiPage[]>
  findChildren(parentPageId: string): Promise<WikiPage[]>
  findArchived(organizationId: string): Promise<WikiPage[]>
  delete(pageId: string): Promise<void>
}
