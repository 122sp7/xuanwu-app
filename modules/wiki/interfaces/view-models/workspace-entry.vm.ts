/**
 * Module: wiki
 * Layer: interfaces/view-models
 * Purpose: Aggregated view-model types used across multiple wiki interface components.
 *          Centralising them here avoids cross-component imports and makes the shape
 *          visible from the module barrel.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WorkspaceEntity } from '@/modules/workspace'
import type { RagDocumentRecord } from '@/modules/file'
import type { WorkspaceKnowledgeSummary } from '../../domain/entities/workspace-knowledge-summary.entity'

/** Aggregated view model combining workspace metadata, knowledge summary, and RAG docs. */
export interface WorkspaceEntry {
  readonly workspace: WorkspaceEntity
  readonly summary: WorkspaceKnowledgeSummary
  readonly docs: readonly RagDocumentRecord[]
}
