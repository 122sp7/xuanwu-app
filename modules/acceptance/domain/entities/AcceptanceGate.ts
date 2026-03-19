export type AcceptanceGateStatus = "ready" | "attention";

export interface AcceptanceGate {
  readonly id: string;
  readonly label: string;
  readonly status: AcceptanceGateStatus;
  readonly detail: string;
}

export interface WorkspaceAcceptanceSummary {
  readonly gates: readonly AcceptanceGate[];
  readonly readyCount: number;
  readonly overallReady: boolean;
}
