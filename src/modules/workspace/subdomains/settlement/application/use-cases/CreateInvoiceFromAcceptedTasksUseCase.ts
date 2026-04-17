import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import type { CreateInvoiceFromAcceptedTasksInput } from "../../domain/entities/Invoice";

/**
 * CreateInvoiceFromAcceptedTasksUseCase
 *
 * Triggered by the TaskLifecycleSaga when a task reaches `accepted` status.
 * Creates a draft invoice with the accepted taskIds linked for traceability.
 */
export class CreateInvoiceFromAcceptedTasksUseCase {
  constructor(private readonly invoiceRepo: InvoiceRepository) {}

  async execute(input: CreateInvoiceFromAcceptedTasksInput): Promise<CommandResult> {
    try {
      const { workspaceId, taskIds } = input;
      if (!workspaceId) {
        return commandFailureFrom("SETTLEMENT_INVALID_INPUT", "workspaceId is required.");
      }
      if (!taskIds.length) {
        return commandFailureFrom("SETTLEMENT_INVALID_INPUT", "At least one taskId is required.");
      }
      const invoice = Invoice.create(uuid(), { workspaceId, taskIds });
      await this.invoiceRepo.save(invoice.getSnapshot());
      return commandSuccess(invoice.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SETTLEMENT_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create invoice from accepted tasks.",
      );
    }
  }
}
