/**
 * Module: wiki
 * Layer: domain
 * Purpose: Barrel re-export for all wiki domain types, ports, services, and value objects.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Entities ─────────────────────────────────────────────────────────────────
export { WikiDocument } from './entities/wiki-document.entity'
export type { WikiDocumentStatus, WikiDocumentScope } from './entities/wiki-document.entity'
export { WikiPage } from './entities/wiki-page.entity'
export type { WikiPageScope, WikiPageStatus } from './entities/wiki-page.entity'
export type {
  WorkspaceKnowledgeSummary,
  WorkspaceKnowledgeStatus,
} from './entities/workspace-knowledge-summary.entity'

// ── Repositories (ports) ─────────────────────────────────────────────────────
export type { IWikiDocumentRepository } from './repositories/iwiki-document.repository'
export type { IWikiPageRepository } from './repositories/iwiki-page.repository'
export type {
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
} from './repositories/iknowledge-summary.repository'
export type {
  IRetrievalRepository,
  RetrievalHit,
} from './repositories/iretrieval.repository'
export type {
  IEmbeddingRepository,
  EmbedTextDTO,
} from './repositories/iembedding.repository'

// ── Services ─────────────────────────────────────────────────────────────────
export {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from './services/derive-knowledge-summary'

// ── Value Objects ─────────────────────────────────────────────────────────────
export { AccessControl } from './value-objects/access-control.vo'
export type { Visibility } from './value-objects/access-control.vo'
export { ContentStatus } from './value-objects/content-status.vo'
export type { ContentStatusValue } from './value-objects/content-status.vo'
export { RAGQueryResult } from './value-objects/rag-query-result.vo'
export type { RAGQueryResultProps, RAGSource } from './value-objects/rag-query-result.vo'
export { WikiDocumentSummary } from './value-objects/wiki-document-summary.vo'
export type { WikiDocumentSummaryProps } from './value-objects/wiki-document-summary.vo'
export { SearchFilter } from './value-objects/search-filter.vo'
export type { DateRange } from './value-objects/search-filter.vo'
export { Taxonomy } from './value-objects/taxonomy.vo'
export { UsageStats } from './value-objects/usage-stats.vo'
export { Vector } from './value-objects/vector.vo'
export { Embedding } from './value-objects/embedding.vo'
export type { EmbeddingProps } from './value-objects/embedding.vo'
