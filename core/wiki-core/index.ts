/**
 * Module: wiki-core
 * Layer: facade
 * Purpose: Integration facade re-exporting all wiki-core public contracts.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities ────────────────────────────────────────────────────────
export { WikiDocument } from './domain/entities/wiki-document.entity'
export type { WikiDocumentStatus, WikiDocumentScope } from './domain/entities/wiki-document.entity'
export { WikiPage } from './domain/entities/wiki-page.entity'
export type { WikiPageScope, WikiPageStatus } from './domain/entities/wiki-page.entity'
export type {
  WorkspaceKnowledgeSummary,
  WorkspaceKnowledgeStatus,
} from './domain/entities/workspace-knowledge-summary.entity'

// ── Domain: Repositories (ports) ────────────────────────────────────────────
export type { IWikiDocumentRepository } from './domain/repositories/iwiki-document.repository'
export type { IWikiPageRepository } from './domain/repositories/iwiki-page.repository'
export type {
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
} from './domain/repositories/iknowledge-summary.repository'
export type {
  IRetrievalRepository,
  RetrievalHit,
} from './domain/repositories/iretrieval.repository'
export type {
  IEmbeddingRepository,
  EmbedTextDTO,
} from './domain/repositories/iembedding.repository'

// ── Domain: Services ────────────────────────────────────────────────────────
export {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from './domain/services/derive-knowledge-summary'

// ── Domain: Value Objects ───────────────────────────────────────────────────
export { AccessControl } from './domain/value-objects/access-control.vo'
export type { Visibility } from './domain/value-objects/access-control.vo'
export { ContentStatus } from './domain/value-objects/content-status.vo'
export type { ContentStatusValue } from './domain/value-objects/content-status.vo'
export { RAGQueryResult } from './domain/value-objects/rag-query-result.vo'
export type { RAGQueryResultProps, RAGSource } from './domain/value-objects/rag-query-result.vo'
export { WikiDocumentSummary } from './domain/value-objects/wiki-document-summary.vo'
export type { WikiDocumentSummaryProps } from './domain/value-objects/wiki-document-summary.vo'
export { SearchFilter } from './domain/value-objects/search-filter.vo'
export type { DateRange } from './domain/value-objects/search-filter.vo'
export { Taxonomy } from './domain/value-objects/taxonomy.vo'
export { UsageStats } from './domain/value-objects/usage-stats.vo'
export { Vector } from './domain/value-objects/vector.vo'
export { Embedding } from './domain/value-objects/embedding.vo'
export type { EmbeddingProps } from './domain/value-objects/embedding.vo'

// ── Application: Use Cases ──────────────────────────────────────────────────
export { CreateWikiDocumentUseCase } from './application/use-cases/create-wiki-document'
export type { CreateWikiDocumentDTO } from './application/use-cases/create-wiki-document'
export { CreateWikiPageUseCase } from './application/use-cases/create-wiki-page.use-case'
export type { CreateWikiPageDTO } from './application/use-cases/create-wiki-page.use-case'
export { GetWorkspaceKnowledgeSummaryUseCase } from './application/use-cases/get-workspace-knowledge-summary.use-case'
export { GetRAGAnswerUseCase } from './application/use-cases/get-rag-answer.use-case'
export type { GetRAGAnswerDTO } from './application/use-cases/get-rag-answer.use-case'
export { SearchWikiDocumentsUseCase } from './application/use-cases/search-wiki-documents.use-case'
export type { SearchWikiDocumentsDTO } from './application/use-cases/search-wiki-documents.use-case'

// ── Infrastructure ──────────────────────────────────────────────────────────
export { UpstashWikiDocumentRepository } from './infrastructure/repositories/upstash-wiki-document.repository'
export { InMemoryWikiDocumentRepository } from './infrastructure/repositories/in-memory-wiki-document.repository'
export { InMemoryWikiPageRepository } from './infrastructure/repositories/in-memory-wiki-page.repository'
export { OpenAIEmbeddingRepository } from './infrastructure/repositories/openai-embedding.repository'

// ── Interfaces ──────────────────────────────────────────────────────────────
export { WikiController } from './interfaces/api/wiki.controller'
