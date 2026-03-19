export type WorkspaceKnowledgeStatus = "needs-input" | "staged" | "ready";

export interface WorkspaceKnowledgeSummary {
  readonly registeredAssetCount: number;
  readonly readyAssetCount: number;
  readonly supportedSourceCount: number;
  readonly status: WorkspaceKnowledgeStatus;
  readonly blockedReasons: readonly string[];
  readonly nextActions: readonly string[];
  readonly visibleSurface: "workspace-tab-live";
  readonly contractStatus: "contract-live";
}
