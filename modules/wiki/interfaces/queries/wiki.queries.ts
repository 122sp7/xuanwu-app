/**
 * Module: wiki
 * Layer: interfaces/queries
 * Purpose: Read-side data fetching for wiki pages.
 * Note: Uses the shared wikiPageRepository singleton so reads see pages written by Server Actions.
 *       Replace with FirestoreWikiPageRepository when the Firestore adapter is implemented.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiPage, WikiPageScope } from '@/modules/wiki'
import { wikiPageRepository } from '../../infrastructure/repositories/registry'

// Shared repository singleton — same instance used by wiki-page.actions.ts so writes are visible here.

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
