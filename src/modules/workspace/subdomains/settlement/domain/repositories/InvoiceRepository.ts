import type { InvoiceSnapshot } from "../entities/Invoice";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

export interface InvoiceRepository {
  findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
  save(invoice: InvoiceSnapshot): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<InvoiceSnapshot | null>;
  delete(invoiceId: string): Promise<void>;
}
