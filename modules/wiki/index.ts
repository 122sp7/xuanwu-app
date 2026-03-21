/**
 * Module: wiki
 * Layer: facade
 * Purpose: Public API for the wiki module.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain re-exports (shim) ─────────────────────────────────────────────────
export type { WikiPage, WikiPageScope, WikiPageStatus } from '@/core/wiki-core'
export type { WikiDocument, WikiDocumentScope, WikiDocumentStatus } from '@/core/wiki-core'

// ── Application re-exports (shim) ────────────────────────────────────────────
export { CreateWikiPageUseCase } from '@/core/wiki-core'
export type { CreateWikiPageDTO } from '@/core/wiki-core'

// ── Interfaces: actions ───────────────────────────────────────────────────────
export { createWikiPage, archiveWikiPage, updateWikiPage } from './interfaces/_actions/wiki-page.actions'

// ── Interfaces: queries ───────────────────────────────────────────────────────
export {
  getOrgWikiPages,
  getWorkspaceWikiPages,
  getArchivedWikiPages,
  getWikiPageChildren,
} from './interfaces/queries/wiki.queries'

// ── Interfaces: components ────────────────────────────────────────────────────
export { WikiPageCard } from './interfaces/components/WikiPageCard'
export { WikiPageView } from './interfaces/components/WikiPageView'
export { CreateWikiPageDialog } from './interfaces/components/CreateWikiPageDialog'
export { WikiHubView } from './interfaces/components/WikiHubView'
export type { WikiHubViewProps, WorkspaceEntry } from './interfaces/components/WikiHubView'
export { WikiWorkspaceDocView } from './interfaces/components/WikiWorkspaceDocView'
export type { WikiWorkspaceDocViewProps } from './interfaces/components/WikiWorkspaceDocView'
export { WikiPagesListView } from './interfaces/components/WikiPagesListView'
export type { WikiPagesListViewProps } from './interfaces/components/WikiPagesListView'
export { WikiArchivedView } from './interfaces/components/WikiArchivedView'
export type { WikiArchivedViewProps } from './interfaces/components/WikiArchivedView'
