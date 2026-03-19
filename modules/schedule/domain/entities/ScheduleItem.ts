export interface WorkspaceFinanceScheduleSnapshot {
  readonly stage: string;
  readonly paymentTermStartAtISO: string | null;
  readonly paymentReceivedAtISO: string | null;
}

export interface WorkspaceScheduleItem {
  readonly id: string;
  readonly title: string;
  readonly timeLabel: string;
  readonly type: "milestone" | "follow-up" | "maintenance";
  readonly status: "upcoming" | "scheduled" | "completed";
  readonly detail: string;
}
