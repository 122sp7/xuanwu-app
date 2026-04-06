/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice-item.converter.ts
 * @description Firestore document-to-entity converter for InvoiceItem.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { InvoiceItem } from "../../domain/entities/InvoiceItem";

/**
 * Converts a raw Firestore document data map into a typed InvoiceItem entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoiceItem(id: string, data: Record<string, unknown>): InvoiceItem {
  return {
    id,
    invoiceId: typeof data.invoiceId === "string" ? data.invoiceId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    amount: typeof data.amount === "number" ? data.amount : 0,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
