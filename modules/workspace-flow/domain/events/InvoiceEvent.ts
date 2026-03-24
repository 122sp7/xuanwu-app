/**
 * @module workspace-flow/domain/events
 * @file InvoiceEvent.ts
 * @description Discriminated-union event types emitted by the Invoice aggregate.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface InvoiceCreatedEvent {
  readonly type: "workspace-flow.invoice.created";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceItemAddedEvent {
  readonly type: "workspace-flow.invoice.item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly occurredAtISO: string;
}

export interface InvoiceItemRemovedEvent {
  readonly type: "workspace-flow.invoice.item_removed";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceSubmittedEvent {
  readonly type: "workspace-flow.invoice.submitted";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly submittedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceReviewedEvent {
  readonly type: "workspace-flow.invoice.reviewed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceApprovedEvent {
  readonly type: "workspace-flow.invoice.approved";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly approvedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceRejectedEvent {
  readonly type: "workspace-flow.invoice.rejected";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoicePaidEvent {
  readonly type: "workspace-flow.invoice.paid";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceClosedEvent {
  readonly type: "workspace-flow.invoice.closed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly closedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceStatusChangedEvent {
  readonly type: "workspace-flow.invoice.status_changed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type InvoiceEvent =
  | InvoiceCreatedEvent
  | InvoiceItemAddedEvent
  | InvoiceItemRemovedEvent
  | InvoiceSubmittedEvent
  | InvoiceReviewedEvent
  | InvoiceApprovedEvent
  | InvoiceRejectedEvent
  | InvoicePaidEvent
  | InvoiceClosedEvent
  | InvoiceStatusChangedEvent;
