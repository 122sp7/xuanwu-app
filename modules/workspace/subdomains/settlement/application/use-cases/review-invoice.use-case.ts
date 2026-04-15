/**
 * @module workspace-flow/application/use-cases
 * @file review-invoice.use-case.ts
 * @description Use case: Move an invoice into finance review (submitted → finance_review).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceReviewedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class ReviewInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "finance_review");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "finance_review", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
 
