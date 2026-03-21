/**
 * Module: wiki-core
 * Layer: domain/port
 * Purpose: Repository contract for workspace knowledge summary aggregation.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WorkspaceKnowledgeSummary } from '../entities/workspace-knowledge-summary.entity'

export interface IKnowledgeSummaryScope {
  readonly workspaceId: string
}

export interface IKnowledgeSummaryRepository {
  summarize(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary
}
