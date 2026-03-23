/**
 * Module: finance
 * Layer: domain/repository port
 * Purpose: IInvoiceRepository — persistence port for the Invoice aggregate.
 *
 * Replaces the old FinanceRepository (claim-based model).
 * Canonical entity: Invoice from domain/entities/Invoice.ts.
 */

import type { Invoice } from "../entities/Invoice";
import type { InvoiceStatus } from "../entities/Invoice";

export interface IInvoiceRepository {
  create(input: CreateInvoiceEntityInput): Promise<Invoice>;
  findById(invoiceId: string): Promise<Invoice | null>;
  findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
  delete(invoiceId: string): Promise<void>;
}

export interface CreateInvoiceEntityInput {
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly currency: "USD" | "TWD";
  readonly invoiceNumber?: string;
}
