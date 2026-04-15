import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

export interface InvoiceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface InvoiceCreatedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-created";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string };
}

export interface InvoiceStatusChangedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-status-changed";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string; readonly to: InvoiceStatus };
}

export type InvoiceDomainEventType = InvoiceCreatedEvent | InvoiceStatusChangedEvent;
