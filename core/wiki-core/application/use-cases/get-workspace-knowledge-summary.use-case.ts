/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: Read-side orchestration for deriving workspace knowledge health summary.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WorkspaceKnowledgeSummary } from '../../domain/entities/workspace-knowledge-summary.entity'
import type {
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
} from '../../domain/repositories/iknowledge-summary.repository'

const EMPTY_SUMMARY: WorkspaceKnowledgeSummary = {
  registeredAssetCount: 0,
  readyAssetCount: 0,
  supportedSourceCount: 0,
  status: 'needs-input',
  blockedReasons: [],
  nextActions: [],
  visibleSurface: 'workspace-tab-live',
  contractStatus: 'contract-live',
}

export class GetWorkspaceKnowledgeSummaryUseCase {
  constructor(private readonly repo: IKnowledgeSummaryRepository) {}

  execute(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary {
    if (!scope.workspaceId.trim()) {
      return EMPTY_SUMMARY
    }

    return this.repo.summarize(scope)
  }
}
