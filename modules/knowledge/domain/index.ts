/**
 * @deprecated modules/knowledge domain types have moved to core/wiki-core.
 * This file re-exports from wiki-core for backward compatibility.
 * Migrate all imports to @/core/wiki-core.
 */
export type { WorkspaceKnowledgeStatus, WorkspaceKnowledgeSummary } from '@/core/wiki-core'
export type { IKnowledgeSummaryRepository, IKnowledgeSummaryScope } from '@/core/wiki-core'
export {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from '@/core/wiki-core'
