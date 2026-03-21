import type { WorkspaceFileListItemDto } from "@/modules/file/application/dto/file.dto";
import type { WorkspaceParserSummary } from "@/modules/parser";
import type { WorkspaceEntity } from "@/modules/workspace";

import type { WorkspaceKnowledgeSummary } from '@/modules/wiki';
import type {
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
} from '@/modules/wiki';
import {
  deriveKnowledgeSummary,
  type KnowledgeSummaryCopy,
  type KnowledgeWorkspaceSnapshot,
} from '@/modules/wiki';

const KNOWLEDGE_SUMMARY_COPY: KnowledgeSummaryCopy = {
  noAssetsBlockedReason: "目前尚未有任何已註冊的知識來源。",
  stagedAction: "先維持已上線的 Knowledge UI，用它確認契約與 parser/file 邊界是否完整。",
  readyAction: "可在 Knowledge UI 進一步驗證 read-side 指標，再銜接後續 ingestion 與 retrieval 寫側。",
  defaultAction: "先確認契約、可見 UI 與後續切塊 / 檢索流程的責任邊界。",
};

export class DefaultWorkspaceKnowledgeRepository implements IKnowledgeSummaryRepository {
  constructor(
    private readonly workspace: WorkspaceEntity,
    private readonly files: readonly WorkspaceFileListItemDto[],
    private readonly parserSummary: WorkspaceParserSummary,
  ) {}

  summarize(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary {
    if (scope.workspaceId !== this.workspace.id) {
      return {
        registeredAssetCount: 0,
        readyAssetCount: 0,
        supportedSourceCount: 0,
        status: "needs-input",
        blockedReasons: [],
        nextActions: [],
        visibleSurface: "workspace-tab-live",
        contractStatus: "contract-live",
      };
    }

    const snapshot: KnowledgeWorkspaceSnapshot = {
      registeredAssetCount: this.files.length,
      readyAssetCount: this.files.filter((file) => file.status === "active").length,
      supportedSourceCount: this.parserSummary.supportedSources,
      parserBlockedReasons: this.parserSummary.blockedReasons,
      parserNextActions: this.parserSummary.nextActions,
    };

    return deriveKnowledgeSummary(snapshot, KNOWLEDGE_SUMMARY_COPY);
  }
}
