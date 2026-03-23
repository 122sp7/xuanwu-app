/**
 * Module: finance
 * Layer: application/dto
 * Purpose: Zod-validated input DTOs for Finance / Invoice use cases.
 */

import { z } from "@lib-zod";
import { INVOICE_STATUSES } from "../../domain/value-objects/invoice-state";

// ── Shared ─────────────────────────────────────────────────────────────────────

export const InvoiceStatusSchema = z.enum(INVOICE_STATUSES);

export const CurrencySchema = z.enum(["USD", "TWD"]);

// ── Create invoice ─────────────────────────────────────────────────────────────

export const CreateInvoiceInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  currency: CurrencySchema,
  invoiceNumber: z.string().min(1).max(50).optional(),
});

export type CreateInvoiceInputDto = z.infer<typeof CreateInvoiceInputSchema>;

// ── Add invoice item ───────────────────────────────────────────────────────────

export const AddInvoiceItemInputSchema = z.object({
  invoiceId: z.string().min(1),
  /** Must reference an accepted task. Caller is responsible for pre-validation. */
  taskId: z.string().min(1),
  description: z.string().min(1).max(500),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

export type AddInvoiceItemInputDto = z.infer<typeof AddInvoiceItemInputSchema>;

// ── Advance invoice stage ──────────────────────────────────────────────────────

export const AdvanceInvoiceInputSchema = z.object({
  invoiceId: z.string().min(1),
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
});

export type AdvanceInvoiceInputDto = z.infer<typeof AdvanceInvoiceInputSchema>;

// ── Record payment ─────────────────────────────────────────────────────────────

export const RecordPaymentInputSchema = z.object({
  invoiceId: z.string().min(1),
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  paidAtISO: z.string().min(1),
});

export type RecordPaymentInputDto = z.infer<typeof RecordPaymentInputSchema>;
