/**
 * Module: finance
 * Layer: domain/value-object
 * Purpose: Invoice lifecycle status and pure state-machine transition helpers.
 *
 * Status flow (forward-only):
 *   draft → submitted → finance_review → approved → paid → closed
 *
 * Invariant:
 *   - Only "draft" invoices accept item mutations.
 *   - "paid" and "closed" are terminal states.
 *   - Finance status is NEVER mixed with Task status or Acceptance status.
 */

import type { InvoiceStatus } from "../entities/Invoice";

export const INVOICE_STATUSES = [
  "draft",
  "submitted",
  "finance_review",
  "approved",
  "paid",
  "closed",
] as const satisfies readonly InvoiceStatus[];

const INVOICE_NEXT: Readonly<Record<InvoiceStatus, InvoiceStatus | null>> = {
  draft: "submitted",
  submitted: "finance_review",
  finance_review: "approved",
  approved: "paid",
  paid: "closed",
  closed: null,
};

export function canTransitionInvoice(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_NEXT[from] === to;
}

export function nextInvoiceStatus(current: InvoiceStatus): InvoiceStatus | null {
  return INVOICE_NEXT[current];
}

export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean {
  return INVOICE_NEXT[status] === null;
}

/** Only draft invoices may have items added or modified. */
export function isInvoiceMutable(status: InvoiceStatus): boolean {
  return status === "draft";
}
