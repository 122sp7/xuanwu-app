export interface RetentionPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly retentionDays: number;
  readonly legalHold: boolean;
  readonly purgeMode: "soft-delete" | "hard-delete";
  readonly updatedAtISO: string;
}

