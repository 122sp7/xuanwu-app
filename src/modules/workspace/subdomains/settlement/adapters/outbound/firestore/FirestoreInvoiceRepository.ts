import type { InvoiceRepository } from "../../../domain/repositories/InvoiceRepository";
import type { InvoiceSnapshot } from "../../../domain/entities/Invoice";
import type { InvoiceStatus } from "../../../domain/value-objects/InvoiceStatus";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreInvoiceRepository implements InvoiceRepository {
  private readonly collection = "invoices";

  constructor(private readonly db: FirestoreLike) {}

  async findById(invoiceId: string): Promise<InvoiceSnapshot | null> {
    const doc = await this.db.get(this.collection, invoiceId);
    return doc ? (doc as unknown as InvoiceSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as InvoiceSnapshot[];
  }

  async save(invoice: InvoiceSnapshot): Promise<void> {
    await this.db.set(this.collection, invoice.id, invoice as unknown as Record<string, unknown>);
  }

  async transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<InvoiceSnapshot | null> {
    const existing = await this.db.get(this.collection, invoiceId);
    if (!existing) return null;
    const updated = {
      ...existing,
      status: to,
      ...(to === "submitted" ? { submittedAtISO: nowISO } : {}),
      ...(to === "approved" ? { approvedAtISO: nowISO } : {}),
      ...(to === "paid" ? { paidAtISO: nowISO } : {}),
      ...(to === "closed" ? { closedAtISO: nowISO } : {}),
      updatedAtISO: nowISO,
    };
    await this.db.set(this.collection, invoiceId, updated);
    return updated as unknown as InvoiceSnapshot;
  }

  async delete(invoiceId: string): Promise<void> {
    await this.db.delete(this.collection, invoiceId);
  }
}
