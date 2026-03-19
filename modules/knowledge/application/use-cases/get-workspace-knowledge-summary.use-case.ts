import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import type { KnowledgeRepository, KnowledgeScope } from "../../domain/repositories/KnowledgeRepository";

const EMPTY_SUMMARY: WorkspaceKnowledgeSummary = {
  registeredAssetCount: 0,
  readyAssetCount: 0,
  supportedSourceCount: 0,
  status: "needs-input",
  blockedReasons: [],
  nextActions: [],
  visibleSurface: "workspace-tab-live",
  contractStatus: "contract-live",
};

export class GetWorkspaceKnowledgeSummaryUseCase {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  execute(scope: KnowledgeScope): WorkspaceKnowledgeSummary {
    if (!scope.workspaceId.trim()) {
      return EMPTY_SUMMARY;
    }

    return this.knowledgeRepository.summarize(scope);
  }
}
