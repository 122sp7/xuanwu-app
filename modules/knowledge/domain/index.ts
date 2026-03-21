/**
 * @deprecated modules/knowledge domain types have moved to core/wiki-core.
 * This file re-exports from wiki-core for backward compatibility.
 * Migrate all imports to @/modules/wiki.
 */
export type { WorkspaceKnowledgeStatus, WorkspaceKnowledgeSummary } from '@/modules/wiki'
export type { IKnowledgeSummaryRepository, IKnowledgeSummaryScope } from '@/modules/wiki'
export {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from '@/modules/wiki'
