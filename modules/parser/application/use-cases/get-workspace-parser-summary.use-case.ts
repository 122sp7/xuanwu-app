import type { WorkspaceParserSummary } from "../../domain/entities/ParserSummary";
import type { ParserRepository, ParserScope } from "../../domain/repositories/ParserRepository";

const EMPTY_SUMMARY: WorkspaceParserSummary = {
  supportedSources: 0,
  readyAssetCount: 0,
  blockedReasons: [],
  nextActions: [],
};

export class GetWorkspaceParserSummaryUseCase {
  constructor(private readonly parserRepository: ParserRepository) {}

  execute(scope: ParserScope): WorkspaceParserSummary {
    if (!scope.workspaceId.trim()) {
      return EMPTY_SUMMARY;
    }

    return this.parserRepository.summarize(scope);
  }
}
