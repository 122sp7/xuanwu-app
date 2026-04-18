import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepo: InvoiceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const invoice = Invoice.create(uuid(), { workspaceId });
      await this.invoiceRepo.save(invoice.getSnapshot());
      return commandSuccess(invoice.id, Date.now());
    } catch (err) {
      return commandFailureFrom("SETTLEMENT_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create invoice.");
    }
  }
}

export class TransitionInvoiceStatusUseCase {
  constructor(private readonly invoiceRepo: InvoiceRepository) {}

  async execute(invoiceId: string, to: InvoiceStatus): Promise<CommandResult> {
    try {
      const snapshot = await this.invoiceRepo.findById(invoiceId);
      if (!snapshot) return commandFailureFrom("SETTLEMENT_NOT_FOUND", "Invoice not found.");
      const invoice = Invoice.reconstitute(snapshot);
      // Aggregate enforces FSM guard — throws on invalid transition (Rule 6, 7, 18)
      invoice.transition(to);
      await this.invoiceRepo.save(invoice.getSnapshot());
      return commandSuccess(invoiceId, Date.now());
    } catch (err) {
      return commandFailureFrom("SETTLEMENT_TRANSITION_FAILED", err instanceof Error ? err.message : "Failed to transition invoice.");
    }
  }
}
