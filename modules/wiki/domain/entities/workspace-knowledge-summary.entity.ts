/**
 * Module: wiki-core
 * Layer: domain/entity
 * Purpose: Workspace-level knowledge health summary — aggregated read-model for wiki hub UI.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export type WorkspaceKnowledgeStatus = 'needs-input' | 'staged' | 'ready'

export interface WorkspaceKnowledgeSummary {
  readonly registeredAssetCount: number
  readonly readyAssetCount: number
  readonly supportedSourceCount: number
  readonly status: WorkspaceKnowledgeStatus
  readonly blockedReasons: readonly string[]
  readonly nextActions: readonly string[]
  readonly visibleSurface: 'workspace-tab-live'
  readonly contractStatus: 'contract-live'
}
