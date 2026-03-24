/**
 * Module: finance
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Finance domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type { Invoice, InvoiceItem, InvoiceStatus } from "../domain/entities/Invoice";

// ─── Lifecycle state machine ──────────────────────────────────────────────────

export {
  INVOICE_STATUSES,
  canTransitionInvoice,
  isTerminalInvoiceStatus,
  isInvoiceMutable,
} from "../domain/value-objects/invoice-state";

// ─── Domain events (cross-domain) ────────────────────────────────────────────

export type {
  FinanceDomainEvent,
  InvoiceCreatedEvent,
  InvoiceItemAddedEvent,
  InvoiceStatusChangedEvent,
  InvoicePaidEvent,
} from "../domain/events/finance.events";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getInvoices } from "../interfaces/queries/finance.queries";
