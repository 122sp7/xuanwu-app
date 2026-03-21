/**
 * Module: wiki
 * Layer: interfaces/view-models
 * Purpose: Aggregated view-model types used across multiple wiki interface components.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WorkspaceEntity } from '@/modules/workspace'
import type { RagDocumentRecord } from '@/modules/file'
import type { WorkspaceKnowledgeSummary } from '@wiki-core'

/** Aggregated view model combining workspace metadata, knowledge summary, and RAG docs. */
export interface WorkspaceEntry {
  readonly workspace: WorkspaceEntity
  readonly summary: WorkspaceKnowledgeSummary
  readonly docs: readonly RagDocumentRecord[]
}
