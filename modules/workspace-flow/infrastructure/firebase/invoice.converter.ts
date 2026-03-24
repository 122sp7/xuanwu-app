/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice.converter.ts
 * @description Firestore document-to-entity converter for Invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Invoice } from "../../domain/entities/Invoice";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

/**
 * Converts a raw Firestore document data map into a typed Invoice entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoice(id: string, data: Record<string, unknown>): Invoice {
  const rawStatus = data.status as InvoiceStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    totalAmount: typeof data.totalAmount === "number" ? data.totalAmount : 0,
    submittedAtISO: typeof data.submittedAtISO === "string" ? data.submittedAtISO : undefined,
    approvedAtISO: typeof data.approvedAtISO === "string" ? data.approvedAtISO : undefined,
    paidAtISO: typeof data.paidAtISO === "string" ? data.paidAtISO : undefined,
    closedAtISO: typeof data.closedAtISO === "string" ? data.closedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
