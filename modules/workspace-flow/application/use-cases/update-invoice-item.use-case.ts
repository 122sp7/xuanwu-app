/**
 * @module workspace-flow/application/use-cases
 * @file update-invoice-item.use-case.ts
 * @description Use case: Update the amount of an existing invoice item on a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { UpdateInvoiceItemDto } from "../dto/update-invoice-item.dto";

export class UpdateInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const item = await this.invoiceRepository.findItemById(invoiceItemId);
    if (!item) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found.");
    }

    const invoice = await this.invoiceRepository.findById(item.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be updated on draft invoices.",
      );
    }

    const updated = await this.invoiceRepository.updateItem(invoiceItemId, dto.amount);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
