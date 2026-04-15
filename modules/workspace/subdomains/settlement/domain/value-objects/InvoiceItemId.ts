/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceItemId.ts
 * @description Branded string value object for InvoiceItem identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceItemIdBrand: unique symbol;

/** Branded string that prevents mixing InvoiceItem IDs with other string IDs. */
export type InvoiceItemId = string & { readonly [InvoiceItemIdBrand]: void };

/** Creates an InvoiceItemId from a plain string (e.g. a Firestore document ID). */
export function invoiceItemId(raw: string): InvoiceItemId {
  return raw as InvoiceItemId;
}
 
