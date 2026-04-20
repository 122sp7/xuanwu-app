import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import type { CreateInvoiceFromAcceptedTasksInput } from "../../domain/entities/Invoice";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { InvoiceCalculationService } from "../../domain/services/InvoiceCalculationService";

/**
 * CreateInvoiceFromAcceptedTasksUseCase
 *
 * Triggered by the TaskLifecycleSaga when a task reaches `accepted` status.
 * Looks up the accepted tasks, builds LineItems from their unitPrice /
 * contractQuantity fields, and creates a draft invoice with computed totals.
 */
export class CreateInvoiceFromAcceptedTasksUseCase {
  constructor(
    private readonly invoiceRepo: InvoiceRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(input: CreateInvoiceFromAcceptedTasksInput): Promise<CommandResult> {
    try {
      const { workspaceId, taskIds } = input;
      if (!workspaceId) {
        return commandFailureFrom("SETTLEMENT_INVALID_INPUT", "workspaceId is required.");
      }
      if (!taskIds.length) {
        return commandFailureFrom("SETTLEMENT_INVALID_INPUT", "At least one taskId is required.");
      }

      const taskSnapshots = await Promise.all(taskIds.map((id) => this.taskRepo.findById(id)));

      const lineItems = taskSnapshots
        .filter((t): t is NonNullable<typeof t> => t !== null)
        .map((t) =>
          InvoiceCalculationService.buildLineItem(
            t.id,
            t.title,
            t.unitPrice ?? 0,
            t.contractQuantity ?? 1,
          ),
        );

      const invoice = Invoice.create(uuid(), { workspaceId, taskIds });
      invoice.setLineItems(lineItems);
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
