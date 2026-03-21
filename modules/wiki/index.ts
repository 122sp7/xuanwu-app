/**
 * Module: wiki
 * Layer: facade
 * Purpose: Public API for the wiki module.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities (value + type) ──────────────────────────────────────────
export { WikiDocument } from './domain'
export type { WikiDocumentStatus, WikiDocumentScope } from './domain'
export { WikiPage } from './domain'
export type { WikiPageScope, WikiPageStatus } from './domain'
export type { WorkspaceKnowledgeSummary, WorkspaceKnowledgeStatus } from './domain'

// ── Domain: Repositories (ports) ──────────────────────────────────────────────
export type { IWikiPageRepository } from './domain'
export type { IWikiDocumentRepository } from './domain'
export type { IKnowledgeSummaryRepository, IKnowledgeSummaryScope } from './domain'
export type { IRetrievalRepository, RetrievalHit } from './domain'
export type { IEmbeddingRepository, EmbedTextDTO } from './domain'

// ── Domain: Services ──────────────────────────────────────────────────────────
export { deriveKnowledgeSummary } from './domain'
export type { KnowledgeSummaryCopy, KnowledgeWorkspaceSnapshot } from './domain'

// ── Domain: Value Objects ─────────────────────────────────────────────────────
export { Taxonomy } from './domain'
export { Embedding } from './domain'
export type { EmbeddingProps } from './domain'
export { RAGQueryResult } from './domain'
export type { RAGQueryResultProps, RAGSource } from './domain'
export { Vector } from './domain'
export { SearchFilter } from './domain'
export type { DateRange } from './domain'
export { AccessControl } from './domain'
export type { Visibility } from './domain'
export { ContentStatus } from './domain'
export type { ContentStatusValue } from './domain'
export { WikiDocumentSummary } from './domain'
export type { WikiDocumentSummaryProps } from './domain'
export { UsageStats } from './domain'

// ── Application: Use Cases ────────────────────────────────────────────────────
export { CreateWikiPageUseCase } from './application'
export type { CreateWikiPageDTO } from './application'
export { ArchiveWikiPageUseCase } from './application'
export type { ArchiveWikiPageDTO } from './application'
export { UpdateWikiPageUseCase } from './application'
export type { UpdateWikiPageDTO } from './application'
export { CreateWikiDocumentUseCase } from './application'
export type { CreateWikiDocumentDTO } from './application'
export { GetWorkspaceKnowledgeSummaryUseCase } from './application'
export { GetRAGAnswerUseCase } from './application'
export type { GetRAGAnswerDTO } from './application'
export { SearchWikiDocumentsUseCase } from './application'
export type { SearchWikiDocumentsDTO } from './application'

// ── Infrastructure ────────────────────────────────────────────────────────────
export { InMemoryWikiPageRepository } from './infrastructure/repositories'
export { InMemoryWikiDocumentRepository } from './infrastructure/repositories'
export { UpstashWikiDocumentRepository } from './infrastructure/repositories'
export { OpenAIEmbeddingRepository } from './infrastructure/repositories'

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
// ── Interfaces: view-models ───────────────────────────────────────────────────
export type { WorkspaceEntry } from './interfaces/view-models/workspace-entry.vm'
