import type { WorkspaceKnowledgeSummary } from "../entities/KnowledgeSummary";

export interface KnowledgeSummaryCopy {
  readonly noAssetsBlockedReason: string;
  readonly stagedAction: string;
  readonly readyAction: string;
  readonly defaultAction: string;
}

export interface KnowledgeWorkspaceSnapshot {
  readonly registeredAssetCount: number;
  readonly readyAssetCount: number;
  readonly supportedSourceCount: number;
  readonly parserBlockedReasons: readonly string[];
  readonly parserNextActions: readonly string[];
}

export function deriveKnowledgeSummary(
  workspace: KnowledgeWorkspaceSnapshot,
  copy: KnowledgeSummaryCopy,
): WorkspaceKnowledgeSummary {
  const blockedReasons = [...workspace.parserBlockedReasons];
  const nextActions = [...workspace.parserNextActions];

  if (workspace.registeredAssetCount === 0) {
    blockedReasons.unshift(copy.noAssetsBlockedReason);
  }

  const status =
    workspace.readyAssetCount === 0
      ? "needs-input"
      : blockedReasons.length > 0
        ? "staged"
        : "ready";

  if (status === "staged") {
    nextActions.push(copy.stagedAction);
  }

  if (status === "ready") {
    nextActions.push(copy.readyAction);
  }

  if (nextActions.length === 0) {
    nextActions.push(copy.defaultAction);
  }

  return {
    registeredAssetCount: workspace.registeredAssetCount,
    readyAssetCount: workspace.readyAssetCount,
    supportedSourceCount: workspace.supportedSourceCount,
    status,
    blockedReasons,
    nextActions: Array.from(new Set(nextActions)),
    visibleSurface: "workspace-tab-live",
    contractStatus: "contract-live",
  };
}
