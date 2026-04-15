/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceId.ts
 * @description Branded string value object for Invoice identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceIdBrand: unique symbol;

/** Branded string that prevents mixing Invoice IDs with other string IDs. */
export type InvoiceId = string & { readonly [InvoiceIdBrand]: void };

/** Creates an InvoiceId from a plain string (e.g. a Firestore document ID). */
export function invoiceId(raw: string): InvoiceId {
  return raw as InvoiceId;
}
 
