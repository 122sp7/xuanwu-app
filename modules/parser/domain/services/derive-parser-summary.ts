import type { WorkspaceParserSummary } from "../entities/ParserSummary";

export interface ParserSummaryCopy {
  readonly noSourcesBlockedReason: string;
  readonly addCoverAction: string;
  readonly addCapabilityAction: string;
  readonly defaultNextAction: string;
}

export interface ParserWorkspaceAssetSnapshot {
  readonly status: "active" | "archived" | "deleted";
}

export interface ParserWorkspaceSnapshot {
  readonly hasPhoto: boolean;
  readonly capabilityCount: number;
  readonly assets: readonly ParserWorkspaceAssetSnapshot[];
}

export interface ParserWorkspaceSnapshotSource {
  readonly photoURL?: string | null;
  readonly capabilityCount: number;
  readonly assets: readonly ParserWorkspaceAssetSnapshot[];
}

export function createParserWorkspaceSnapshot(
  source: ParserWorkspaceSnapshotSource,
): ParserWorkspaceSnapshot {
  return {
    hasPhoto: Boolean(source.photoURL?.trim()),
    capabilityCount: source.capabilityCount,
    assets: source.assets,
  };
}

export function deriveParserSummary(
  workspace: ParserWorkspaceSnapshot,
  copy: ParserSummaryCopy,
): WorkspaceParserSummary {
  const blockedReasons: string[] = [];
  const nextActions: string[] = [];
  const assetStats = workspace.assets.reduce(
    (summary, asset) => {
      summary.supportedSources += 1;
      if (asset.status === "active") {
        summary.readyAssetCount += 1;
      }

      return summary;
    },
    { supportedSources: 0, readyAssetCount: 0 },
  );

  if (workspace.assets.length === 0) {
    blockedReasons.push(copy.noSourcesBlockedReason);
  }

  if (!workspace.hasPhoto) {
    nextActions.push(copy.addCoverAction);
  }

  if (workspace.capabilityCount === 0) {
    nextActions.push(copy.addCapabilityAction);
  }

  if (nextActions.length === 0) {
    nextActions.push(copy.defaultNextAction);
  }

  return {
    supportedSources: assetStats.supportedSources,
    readyAssetCount: assetStats.readyAssetCount,
    blockedReasons,
    nextActions,
  };
}
