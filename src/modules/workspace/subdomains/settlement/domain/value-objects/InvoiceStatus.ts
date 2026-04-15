export type InvoiceStatus = "draft" | "submitted" | "finance_review" | "approved" | "paid" | "closed";

export const INVOICE_STATUSES = ["draft", "submitted", "finance_review", "approved", "paid", "closed"] as const satisfies readonly InvoiceStatus[];

const INVOICE_NEXT: Readonly<Record<InvoiceStatus, readonly InvoiceStatus[]>> = {
  draft: ["submitted"],
  submitted: ["finance_review"],
  finance_review: ["approved", "submitted"],
  approved: ["paid"],
  paid: ["closed"],
  closed: [],
};

export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_NEXT[from].includes(to);
}

export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean {
  return INVOICE_NEXT[status].length === 0;
}
