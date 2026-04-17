import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import { canTransitionInvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
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
      if (!canTransitionInvoiceStatus(snapshot.status, to)) {
        return commandFailureFrom("SETTLEMENT_INVALID_TRANSITION", `Cannot transition invoice from '${snapshot.status}' to '${to}'.`);
      }
      const updated = await this.invoiceRepo.transitionStatus(invoiceId, to, new Date().toISOString());
      if (!updated) return commandFailureFrom("SETTLEMENT_NOT_FOUND", "Invoice not found after update.");
      return commandSuccess(invoiceId, Date.now());
    } catch (err) {
      return commandFailureFrom("SETTLEMENT_TRANSITION_FAILED", err instanceof Error ? err.message : "Failed to transition invoice.");
    }
  }
}
