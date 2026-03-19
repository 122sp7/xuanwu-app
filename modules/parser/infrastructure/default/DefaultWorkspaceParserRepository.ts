import type { WorkspaceFileListItemDto } from "@/modules/file/application/dto/file.dto";
import type { WorkspaceEntity } from "@/modules/workspace";

import type { WorkspaceParserSummary } from "../../domain/entities/ParserSummary";
import type { ParserRepository, ParserScope } from "../../domain/repositories/ParserRepository";
import {
  createParserWorkspaceSnapshot,
  deriveParserSummary,
  type ParserSummaryCopy,
  type ParserWorkspaceSnapshotSource,
} from "../../domain/services/derive-parser-summary";

const PARSER_SUMMARY_COPY: ParserSummaryCopy = {
  noSourcesBlockedReason: "目前沒有任何可供解析的工作區資產。",
  addCoverAction: "若有平面圖、報價或合約截圖，可先補上工作區封面或附件來源。",
  addCapabilityAction: "先掛載 capability，讓後續文件解析結果能對應到實際流程。",
  defaultNextAction: "可以從已註冊的資產挑選來源，準備進入知識或審計流程。",
};

function toParserSnapshotSource(
  workspace: WorkspaceEntity,
  files: readonly WorkspaceFileListItemDto[],
): ParserWorkspaceSnapshotSource {
  return {
    photoURL: workspace.photoURL,
    capabilityCount: workspace.capabilities.length,
    assets: files.map((file) => ({
      status: file.status,
    })),
  };
}

export class DefaultWorkspaceParserRepository implements ParserRepository {
  constructor(
    private readonly workspace: WorkspaceEntity,
    private readonly files: readonly WorkspaceFileListItemDto[],
  ) {}

  summarize(scope: ParserScope): WorkspaceParserSummary {
    if (scope.workspaceId !== this.workspace.id) {
      return {
        supportedSources: 0,
        readyAssetCount: 0,
        blockedReasons: [],
        nextActions: [],
      };
    }

    return deriveParserSummary(
      createParserWorkspaceSnapshot(toParserSnapshotSource(this.workspace, this.files)),
      PARSER_SUMMARY_COPY,
    );
  }
}
