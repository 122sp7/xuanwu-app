import type { Invoice, InvoiceItem } from "../../application/dto/workflow.dto";

export interface InvoiceSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: Invoice["status"];
  readonly totalAmount: number;
}

export interface InvoiceItemSummary {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: InvoiceItem["amount"];
}

export function toInvoiceSummary(invoice: Invoice): InvoiceSummary {
  return {
    id: invoice.id,
    workspaceId: invoice.workspaceId,
    status: invoice.status,
    totalAmount: invoice.totalAmount,
  };
}

export function toInvoiceItemSummary(item: InvoiceItem): InvoiceItemSummary {
  return {
    id: item.id,
    invoiceId: item.invoiceId,
    taskId: item.taskId,
    amount: item.amount,
  };
}
