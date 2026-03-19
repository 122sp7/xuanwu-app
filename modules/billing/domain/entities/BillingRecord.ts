export type BillingStatus = "pending" | "paid" | "failed" | "refunded";

export interface BillingRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly description: string;
  readonly amountCents: number;
  readonly currency: "USD" | "TWD";
  readonly status: BillingStatus;
  readonly invoiceNumber?: string;
  readonly dueAtISO?: string;
  readonly paidAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface BillingRecordListScope {
  readonly organizationId: string;
  readonly workspaceId?: string;
}
