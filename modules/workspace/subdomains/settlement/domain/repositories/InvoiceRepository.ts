/**
 * @module workspace-flow/domain/repositories
 * @file InvoiceRepository.ts
 * @description Repository port interface for Invoice persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseInvoiceRepository
 */

import type { Invoice, CreateInvoiceInput } from "../entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../entities/InvoiceItem";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

export interface InvoiceRepository {
  /** Persist a new invoice and return the created aggregate. */
  create(input: CreateInvoiceInput): Promise<Invoice>;
  /** Hard-delete an invoice by id. */
  delete(invoiceId: string): Promise<void>;
  /** Retrieve an invoice by its id. Returns null if not found. */
  findById(invoiceId: string): Promise<Invoice | null>;
  /** List all invoices for a given workspace. */
  findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
  /** Persist a lifecycle status transition and stamp relevant timestamp. */
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
  /** Add an item to an invoice and recalculate totalAmount. */
  addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>;
  /** Retrieve a single invoice item by its id. Returns null if not found. */
  findItemById(invoiceItemId: string): Promise<InvoiceItem | null>;
  /** Update the amount of an existing item and recalculate totalAmount. Returns null if not found. */
  updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>;
  /** Remove an item from an invoice and recalculate totalAmount. */
  removeItem(invoiceItemId: string): Promise<void>;
  /** List all items for an invoice. */
  listItems(invoiceId: string): Promise<InvoiceItem[]>;
}
 
