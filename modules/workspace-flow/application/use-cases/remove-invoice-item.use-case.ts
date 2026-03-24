/**
 * @module workspace-flow/application/use-cases
 * @file remove-invoice-item.use-case.ts
 * @description Use case: Remove an item from a draft invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceItemRemovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";

export class RemoveInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string, invoiceItemId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be removed from draft invoices.",
      );
    }

    await this.invoiceRepository.removeItem(invoiceItemId);
    return commandSuccess(invoiceItemId, Date.now());
  }
}
