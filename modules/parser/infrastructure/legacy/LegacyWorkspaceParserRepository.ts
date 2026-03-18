import type { WorkspaceEntity } from "@/modules/workspace";
import {
  getWorkspaceFileAssets,
  getWorkspaceParserSummary,
} from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";

import type { WorkspaceParserSummary } from "../../domain/entities/ParserSummary";
import type { ParserRepository, ParserScope } from "../../domain/repositories/ParserRepository";

export class LegacyWorkspaceParserRepository implements ParserRepository {
  constructor(private readonly workspace: WorkspaceEntity) {}

  summarize(scope: ParserScope): WorkspaceParserSummary {
    if (scope.workspaceId !== this.workspace.id) {
      return {
        supportedSources: 0,
        readyAssetCount: 0,
        blockedReasons: [],
        nextActions: [],
      };
    }

    return getWorkspaceParserSummary(this.workspace, getWorkspaceFileAssets(this.workspace));
  }
}
