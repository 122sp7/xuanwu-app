/**
 * @module workspace-flow/application/use-cases
 * @file submit-invoice.use-case.ts
 * @description Use case: Submit an invoice for review (draft → submitted). Requires at least one item.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceSubmittedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
import { invoiceHasItems } from "../../domain/services/invoice-guards";

export class SubmitInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "submitted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const items = await this.invoiceRepository.listItems(invoiceId);
    if (!invoiceHasItems(items.length)) {
      return commandFailureFrom(
        "WF_INVOICE_NO_ITEMS",
        "Invoice cannot be submitted: at least one item is required.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "submitted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
 
