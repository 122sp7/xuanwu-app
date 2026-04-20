import type { InvoiceRepository } from "../../../domain/repositories/InvoiceRepository";
import type { InvoiceSnapshot } from "../../../domain/entities/Invoice";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

/**
 * Backfills default values for fields added after initial schema.
 * Ensures old Firestore documents (missing lineItems/currency/subtotal/taxRate/taxAmount)
 * are read back as valid InvoiceSnapshot without runtime crashes. (Rule 4)
 */
function toInvoiceSnapshot(raw: Record<string, unknown>): InvoiceSnapshot {
  return {
    id: raw.id as string,
    workspaceId: raw.workspaceId as string,
    taskIds: Array.isArray(raw.taskIds) ? (raw.taskIds as string[]) : [],
    status: raw.status as InvoiceSnapshot["status"],
    lineItems: Array.isArray(raw.lineItems) ? (raw.lineItems as InvoiceSnapshot["lineItems"]) : [],
    currency: typeof raw.currency === "string" ? raw.currency : "TWD",
    subtotal: typeof raw.subtotal === "number" ? raw.subtotal : 0,
    taxRate: typeof raw.taxRate === "number" ? raw.taxRate : 0.05,
    taxAmount: typeof raw.taxAmount === "number" ? raw.taxAmount : 0,
    totalAmount: typeof raw.totalAmount === "number" ? raw.totalAmount : 0,
    submittedAtISO: (raw.submittedAtISO as string | null) ?? null,
    approvedAtISO: (raw.approvedAtISO as string | null) ?? null,
    paidAtISO: (raw.paidAtISO as string | null) ?? null,
    closedAtISO: (raw.closedAtISO as string | null) ?? null,
    createdAtISO: raw.createdAtISO as string,
    updatedAtISO: raw.updatedAtISO as string,
  };
}

export class FirestoreInvoiceRepository implements InvoiceRepository {
  private readonly collection = "invoices";

  constructor(private readonly db: FirestoreLike) {}

  async findById(invoiceId: string): Promise<InvoiceSnapshot | null> {
    const doc = await this.db.get(this.collection, invoiceId);
    return doc ? toInvoiceSnapshot(doc) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs.map(toInvoiceSnapshot);
  }

  async save(invoice: InvoiceSnapshot): Promise<void> {
    await this.db.set(this.collection, invoice.id, invoice as unknown as Record<string, unknown>);
  }

  async delete(invoiceId: string): Promise<void> {
    await this.db.delete(this.collection, invoiceId);
  }
}
