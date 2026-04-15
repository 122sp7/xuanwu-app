import type { Invoice, InvoiceItem } from "../../application/dto/workflow.dto";
import { makeInvoiceRepo } from "../../api/factories";

export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]> {
  return makeInvoiceRepo().findByWorkspaceId(workspaceId);
}

export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  return makeInvoiceRepo().listItems(invoiceId);
}
