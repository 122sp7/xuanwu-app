import type { InvoiceSnapshot } from "../entities/Invoice";

export interface InvoiceRepository {
  findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
  save(invoice: InvoiceSnapshot): Promise<void>;
  delete(invoiceId: string): Promise<void>;
}
