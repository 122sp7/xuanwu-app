import { z } from "@lib-zod";
import { INVOICE_STATUSES } from "../../domain/value-objects/InvoiceStatus";

export const CreateInvoiceSchema = z.object({
  workspaceId: z.string().uuid(),
});

export const TransitionInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
  to: z.enum(INVOICE_STATUSES),
});

export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>;
export type TransitionInvoiceDTO = z.infer<typeof TransitionInvoiceSchema>;
