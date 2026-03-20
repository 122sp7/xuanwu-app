/**
 * Module: wiki-core
 * Layer: facade
 * Purpose: Integration facade re-exporting all wiki-core public contracts.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities ────────────────────────────────────────────────────────
export { WikiDocument } from './domain/entities/wiki-document.entity'
export type { WikiDocumentStatus } from './domain/entities/wiki-document.entity'
export type {
  WorkspaceKnowledgeSummary,
  WorkspaceKnowledgeStatus,
} from './domain/entities/workspace-knowledge-summary.entity'

// ── Domain: Repositories (ports) ────────────────────────────────────────────
export type { IWikiDocumentRepository } from './domain/repositories/iwiki-document.repository'
export type {
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
} from './domain/repositories/iknowledge-summary.repository'
export type {
  IRetrievalRepository,
  RetrievalHit,
} from './domain/repositories/iretrieval.repository'

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
export { WikiDocumentSummary } from './domain/value-objects/wiki-document-summary.vo'
export type { WikiDocumentSummaryProps } from './domain/value-objects/wiki-document-summary.vo'
export { SearchFilter } from './domain/value-objects/search-filter.vo'
export type { DateRange } from './domain/value-objects/search-filter.vo'
export { Taxonomy } from './domain/value-objects/taxonomy.vo'
export { UsageStats } from './domain/value-objects/usage-stats.vo'
export { Vector } from './domain/value-objects/vector.vo'

// ── Application: Use Cases ──────────────────────────────────────────────────
export { CreateWikiDocumentUseCase } from './application/use-cases/create-wiki-document'
export type { CreateWikiDocumentDTO } from './application/use-cases/create-wiki-document'
export { GetWorkspaceKnowledgeSummaryUseCase } from './application/use-cases/get-workspace-knowledge-summary.use-case'

// ── Infrastructure ──────────────────────────────────────────────────────────
export { UpstashWikiDocumentRepository } from './infrastructure/repositories/upstash-wiki-document.repository'

// ── Interfaces ──────────────────────────────────────────────────────────────
export { WikiController } from './interfaces/api/wiki.controller'
