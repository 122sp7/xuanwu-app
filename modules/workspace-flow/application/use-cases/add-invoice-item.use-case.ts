/**
 * @module workspace-flow/application/use-cases
 * @file add-invoice-item.use-case.ts
 * @description Use case: Add an item to a draft invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceItemAddedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";

export class AddInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(dto: AddInvoiceItemDto): Promise<CommandResult> {
    if (!dto.invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_INVOICE_TASK_REQUIRED", "Task id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const invoice = await this.invoiceRepository.findById(dto.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be added to draft invoices.",
      );
    }

    const item = await this.invoiceRepository.addItem(dto);
    return commandSuccess(item.id, Date.now());
  }
}
