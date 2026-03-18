export interface WorkspaceParserSummary {
  readonly supportedSources: number;
  readonly readyAssetCount: number;
  readonly blockedReasons: readonly string[];
  readonly nextActions: readonly string[];
}
