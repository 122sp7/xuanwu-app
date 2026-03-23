/**
 * Module: finance
 * Layer: domain/event
 * Purpose: Domain events emitted by the Finance / Invoice aggregate.
 *
 * Event flow:
 *   InvoiceCreated → InvoiceItemAdded(×n) → InvoiceSubmitted
 *     → InvoiceReviewed → InvoiceApproved → InvoicePaid → InvoiceClosed
 *
 * Note: Finance domain does NOT emit TaskDomainEvents.
 * It reads TaskAcceptedEvent (from Task domain) as a trigger to create invoice lines.
 */

import type { InvoiceStatus } from "../entities/Invoice";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface InvoiceCreatedEvent {
  readonly type: "finance.invoice_created";
  readonly invoiceId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceItemAddedEvent {
  readonly type: "finance.invoice_item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  /** The accepted task being billed. */
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly lineAmount: number;
  readonly occurredAtISO: string;
}

export interface InvoiceStatusChangedEvent {
  readonly type: "finance.invoice_status_changed";
  readonly invoiceId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}

export interface InvoicePaidEvent {
  readonly type: "finance.invoice_paid";
  readonly invoiceId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly totalAmount: number;
  readonly currency: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type FinanceDomainEvent =
  | InvoiceCreatedEvent
  | InvoiceItemAddedEvent
  | InvoiceStatusChangedEvent
  | InvoicePaidEvent;
