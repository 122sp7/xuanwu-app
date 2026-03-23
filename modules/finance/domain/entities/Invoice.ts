/**
 * Module: finance
 * Layer: domain/entity
 * Purpose: Invoice aggregate — the formal financial document linking accepted tasks to payment.
 *
 * Design rationale:
 *   FinanceAggregateEntity (existing) models a workspace-level financial lifecycle.
 *   Invoice + InvoiceItem (this file) models the concrete invoice document created
 *   after one or more Tasks are accepted and selected for billing.
 *
 * Domain invariant: A task MUST be in "accepted" status before it can be added as an InvoiceItem.
 * Finance status is kept ENTIRELY separate from Task status — they are different state machines.
 *
 * Invoice flow:  draft → submitted → finance_review → approved → paid → closed
 */

// ── InvoiceStatus ─────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";

// ── Invoice aggregate ─────────────────────────────────────────────────────────

export interface Invoice {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  /** Human-readable invoice reference number, e.g. "INV-2025-001". */
  readonly invoiceNumber?: string;
  readonly items: readonly InvoiceItem[];
  /** Derived total: sum of all item amounts. */
  readonly totalAmount: number;
  readonly currency: "USD" | "TWD";
  readonly issuedAtISO?: string;
  readonly submittedAtISO?: string;
  readonly approvedAtISO?: string;
  readonly paidAtISO?: string;
  readonly closedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── InvoiceItem (value object embedded in Invoice) ────────────────────────────

export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  /**
   * The accepted Task this line item represents.
   * Task status MUST be "accepted" before this reference is valid.
   */
  readonly taskId: string;
  readonly description: string;
  readonly unitPrice: number;
  readonly quantity: number;
  /** Derived: unitPrice × quantity. */
  readonly lineAmount: number;
}

// ── Domain helpers ────────────────────────────────────────────────────────────

/** Recalculates the invoice total from its current items. */
export function calculateInvoiceTotal(items: readonly InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.lineAmount, 0);
}
