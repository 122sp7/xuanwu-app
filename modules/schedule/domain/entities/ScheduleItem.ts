export interface WorkspaceFinanceScheduleSnapshot {
  readonly stage: string;
  readonly paymentTermStartAtISO: string | null;
  readonly paymentReceivedAtISO: string | null;
}

export interface WorkspaceScheduleItem {
  readonly id: string;
  readonly title: string;
  readonly timeLabel: string;
  /** ISO 8601 datetime string for the item's start date, if deterministic. Null when unknown. */
  readonly startAtISO: string | null;
  readonly type: "milestone" | "follow-up" | "maintenance";
  readonly status: "upcoming" | "scheduled" | "completed";
  readonly detail: string;
}
