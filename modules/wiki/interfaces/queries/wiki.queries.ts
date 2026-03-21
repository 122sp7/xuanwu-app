/**
 * Module: wiki
 * Layer: interfaces/queries
 * Purpose: Read-side data fetching for wiki pages.
 * Note: Uses InMemoryWikiPageRepository as stub; replace with FirestoreWikiPageRepository
 *       when the Firestore adapter is implemented in Phase 3.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiPage, WikiPageScope } from '@/modules/wiki'
import { InMemoryWikiPageRepository } from '@/modules/wiki'

// Stub repository shared across calls during the same server process lifetime.
// Production implementation will use a Firestore-backed repository.
const wikiPageRepository = new InMemoryWikiPageRepository()

export async function getOrgWikiPages(
  organizationId: string,
  scope?: WikiPageScope,
): Promise<WikiPage[]> {
  return wikiPageRepository.findByOrganization(organizationId, scope)
}

export async function getWorkspaceWikiPages(
  organizationId: string,
  workspaceId: string,
): Promise<WikiPage[]> {
  return wikiPageRepository.findByWorkspace(organizationId, workspaceId)
}

export async function getArchivedWikiPages(organizationId: string): Promise<WikiPage[]> {
  return wikiPageRepository.findArchived(organizationId)
}

export async function getWikiPageChildren(parentPageId: string): Promise<WikiPage[]> {
  return wikiPageRepository.findChildren(parentPageId)
}
