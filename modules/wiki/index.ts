/**
 * Module: wiki
 * Layer: facade
 * Purpose: Public API for the wiki module.
 *
 * Domain types and use-cases come from their canonical packages:
 *   @wiki-core   — entities, value objects, repository ports, domain services
 *   @wiki-service — application use-case classes
 *
 * Infrastructure adapters and interface wiring remain in this module.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities ──────────────────────────────────────────────────────────
export { WikiDocument } from '@wiki-core'
export type { WikiDocumentStatus, WikiDocumentScope } from '@wiki-core'
export { WikiPage } from '@wiki-core'
export type { WikiPageScope, WikiPageStatus } from '@wiki-core'
export type { WorkspaceKnowledgeSummary, WorkspaceKnowledgeStatus } from '@wiki-core'

// ── Domain: Repository Ports ──────────────────────────────────────────────────
export type { IWikiPageRepository } from '@wiki-core'
export type { IWikiDocumentRepository } from '@wiki-core'
export type { IKnowledgeSummaryRepository, IKnowledgeSummaryScope } from '@wiki-core'
export type { IRetrievalRepository, RetrievalHit } from '@wiki-core'
export type { IEmbeddingRepository, EmbedTextDTO } from '@wiki-core'

// ── Domain: Services ──────────────────────────────────────────────────────────
export { deriveKnowledgeSummary } from '@wiki-core'
export type { KnowledgeSummaryCopy, KnowledgeWorkspaceSnapshot } from '@wiki-core'

// ── Domain: Value Objects ─────────────────────────────────────────────────────
export { Taxonomy } from '@wiki-core'
export { Embedding } from '@wiki-core'
export type { EmbeddingProps } from '@wiki-core'
export { RAGQueryResult } from '@wiki-core'
export type { RAGQueryResultProps, RAGSource } from '@wiki-core'
export { Vector } from '@wiki-core'
export { SearchFilter } from '@wiki-core'
export type { DateRange } from '@wiki-core'
export { AccessControl } from '@wiki-core'
export type { Visibility } from '@wiki-core'
export { ContentStatus } from '@wiki-core'
export type { ContentStatusValue } from '@wiki-core'
export { WikiDocumentSummary } from '@wiki-core'
export type { WikiDocumentSummaryProps } from '@wiki-core'
export { UsageStats } from '@wiki-core'

// ── Application: Use Cases ────────────────────────────────────────────────────
export { CreateWikiPageUseCase } from '@wiki-service'
export type { CreateWikiPageDTO } from '@wiki-service'
export { ArchiveWikiPageUseCase } from '@wiki-service'
export type { ArchiveWikiPageDTO } from '@wiki-service'
export { UpdateWikiPageUseCase } from '@wiki-service'
export type { UpdateWikiPageDTO } from '@wiki-service'
export { CreateWikiDocumentUseCase } from '@wiki-service'
export type { CreateWikiDocumentDTO } from '@wiki-service'
export { GetWorkspaceKnowledgeSummaryUseCase } from '@wiki-service'
export { GetRAGAnswerUseCase } from '@wiki-service'
export type { GetRAGAnswerDTO } from '@wiki-service'
export { SearchWikiDocumentsUseCase } from '@wiki-service'
export type { SearchWikiDocumentsDTO } from '@wiki-service'

// ── Infrastructure: Repositories ──────────────────────────────────────────────
// In-memory stubs and the OpenAI adapter are client-safe (no server-only imports).
// Upstash adapters are server-only — import from the deep path in server-side code:
//   import { UpstashWikiDocumentRepository } from '@/modules/wiki/infrastructure/repositories'
export { InMemoryWikiPageRepository } from './infrastructure/repositories/in-memory-wiki-page.repository'
export { InMemoryWikiDocumentRepository } from './infrastructure/repositories/in-memory-wiki-document.repository'
export { OpenAIEmbeddingRepository } from './infrastructure/repositories/openai-embedding.repository'
export { DefaultWorkspaceKnowledgeRepository } from './infrastructure/default/DefaultWorkspaceKnowledgeRepository'

// ── Interfaces: Actions ───────────────────────────────────────────────────────
export { createWikiPage, archiveWikiPage, updateWikiPage } from './interfaces/_actions/wiki-page.actions'

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getOrgWikiPages,
  getWorkspaceWikiPages,
  getArchivedWikiPages,
  getWikiPageChildren,
} from './interfaces/queries/wiki.queries'
export { getWorkspaceKnowledgeSummary } from './interfaces/queries/knowledge.queries'

// ── Interfaces: Components ────────────────────────────────────────────────────
export { WikiPageCard } from './interfaces/components/WikiPageCard'
export { WikiPageView } from './interfaces/components/WikiPageView'
export { CreateWikiPageDialog } from './interfaces/components/CreateWikiPageDialog'
export { RagSearchBar } from './interfaces/components/RagSearchBar'
export type { RagSearchBarProps } from './interfaces/components/RagSearchBar'
export { WikiHubView } from './interfaces/components/WikiHubView'
export type { WikiHubViewProps } from './interfaces/components/WikiHubView'
export { WikiWorkspaceDocView } from './interfaces/components/WikiWorkspaceDocView'
export type { WikiWorkspaceDocViewProps } from './interfaces/components/WikiWorkspaceDocView'
export { WikiPagesListView } from './interfaces/components/WikiPagesListView'
export type { WikiPagesListViewProps } from './interfaces/components/WikiPagesListView'
export { WikiArchivedView } from './interfaces/components/WikiArchivedView'
export type { WikiArchivedViewProps } from './interfaces/components/WikiArchivedView'

// ── Interfaces: View Models ───────────────────────────────────────────────────
export type { WorkspaceEntry } from './interfaces/view-models/workspace-entry.vm'
