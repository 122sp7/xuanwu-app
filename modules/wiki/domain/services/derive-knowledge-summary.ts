/**
 * Module: wiki-core
 * Layer: domain/service
 * Purpose: Pure function deriving workspace knowledge health summary from parser and file snapshots.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WorkspaceKnowledgeSummary } from '../entities/workspace-knowledge-summary.entity'

export interface KnowledgeSummaryCopy {
  readonly noAssetsBlockedReason: string
  readonly stagedAction: string
  readonly readyAction: string
  readonly defaultAction: string
}

export interface KnowledgeWorkspaceSnapshot {
  readonly registeredAssetCount: number
  readonly readyAssetCount: number
  readonly supportedSourceCount: number
  readonly parserBlockedReasons: readonly string[]
  readonly parserNextActions: readonly string[]
}

export function deriveKnowledgeSummary(
  workspace: KnowledgeWorkspaceSnapshot,
  copy: KnowledgeSummaryCopy,
): WorkspaceKnowledgeSummary {
  const blockedReasons: string[] = []
  const nextActionSet = new Set<string>()

  for (const reason of workspace.parserBlockedReasons) {
    blockedReasons.push(reason)
  }

  for (const action of workspace.parserNextActions) {
    nextActionSet.add(action)
  }

  if (workspace.registeredAssetCount === 0) {
    blockedReasons.unshift(copy.noAssetsBlockedReason)
  }

  const status =
    workspace.readyAssetCount === 0
      ? 'needs-input'
      : blockedReasons.length > 0
        ? 'staged'
        : 'ready'

  if (status === 'staged') {
    nextActionSet.add(copy.stagedAction)
  }

  if (status === 'ready') {
    nextActionSet.add(copy.readyAction)
  }

  if (nextActionSet.size === 0) {
    nextActionSet.add(copy.defaultAction)
  }

  return {
    registeredAssetCount: workspace.registeredAssetCount,
    readyAssetCount: workspace.readyAssetCount,
    supportedSourceCount: workspace.supportedSourceCount,
    status,
    blockedReasons,
    nextActions: Array.from(nextActionSet),
    visibleSurface: 'workspace-tab-live',
    contractStatus: 'contract-live',
  }
}
