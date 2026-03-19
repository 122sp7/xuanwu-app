/**
 * Finance Domain Entities — pure TypeScript, zero framework dependencies.
 */

export type FinanceLifecycleStage =
  | "claim-preparation"
  | "claim-submitted"
  | "claim-approved"
  | "invoice-requested"
  | "payment-term"
  | "payment-received"
  | "completed";

export interface FinanceClaimLineItem {
  readonly itemId: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly lineAmount: number;
}

export interface FinanceAggregateEntity {
  readonly workspaceId: string;
  readonly stage: FinanceLifecycleStage;
  readonly cycleIndex: number;
  readonly receivedAmount: number;
  readonly currentClaimLineItems: FinanceClaimLineItem[];
  readonly paymentTermStartAtISO: string | null;
  readonly paymentReceivedAtISO: string | null;
  readonly updatedAt: number;
}

// ─── Domain Logic — Finance Stage Transitions ─────────────────────────────────

const STAGE_ORDER: FinanceLifecycleStage[] = [
  "claim-preparation",
  "claim-submitted",
  "claim-approved",
  "invoice-requested",
  "payment-term",
  "payment-received",
  "completed",
];

export function canAdvanceStage(current: FinanceLifecycleStage): boolean {
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1;
}

export function nextStage(current: FinanceLifecycleStage): FinanceLifecycleStage {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) {
    throw new Error(`Cannot advance from stage: ${current}`);
  }
  return STAGE_ORDER[idx + 1];
}

export function calculateTotalClaim(items: FinanceClaimLineItem[]): number {
  return items.reduce((sum, item) => sum + item.lineAmount, 0);
}
