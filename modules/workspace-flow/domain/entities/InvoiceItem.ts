/**
 * @module workspace-flow/domain/entities
 * @file InvoiceItem.ts
 * @description InvoiceItem entity linking a task to an invoice with an amount.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

// ── Entity ────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface AddInvoiceItemInput {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
