/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceStatus.ts
 * @description Invoice lifecycle status union, transition table, and helpers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add additional transition guards as billing rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";

export const INVOICE_STATUSES = [
  "draft",
  "submitted",
  "finance_review",
  "approved",
  "paid",
  "closed",
] as const satisfies readonly InvoiceStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for invoice lifecycle.
 *
 * draft → submitted (SUBMIT / item_count > 0)
 * submitted → finance_review (REVIEW)
 * finance_review → approved (APPROVE)
 * finance_review → submitted (REJECT — back to submitted for resubmission)
 * approved → paid (PAY)
 * paid → closed (CLOSE)
 */
const INVOICE_NEXT: Readonly<Record<InvoiceStatus, readonly InvoiceStatus[]>> = {
  draft: ["submitted"],
  submitted: ["finance_review"],
  finance_review: ["approved", "submitted"],
  approved: ["paid"],
  paid: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_NEXT[from].includes(to);
}

/** Returns true when the invoice has reached a terminal state and cannot progress. */
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean {
  return INVOICE_NEXT[status].length === 0;
}
