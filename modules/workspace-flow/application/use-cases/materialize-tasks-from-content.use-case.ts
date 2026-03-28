/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-content.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `content.page_approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice.  This use case does NOT check for duplicates itself;
 * that responsibility belongs to the ContentToWorkflowMaterializer process
 * manager which wraps this use case.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromContentDto } from "../dto/materialize-from-content.dto";

export class MaterializeTasksFromContentUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(dto: MaterializeFromContentDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.contentPageId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_PAGE_REQUIRED", "contentPageId is required.");
    }

    const taskIds: string[] = [];
    for (const item of dto.extractedTasks) {
      if (!item.title.trim()) continue;
      const task = await this.taskRepository.create({
        workspaceId: dto.workspaceId,
        title: item.title.trim(),
        description: item.description ?? "",
        dueDateISO: item.dueDate,
        sourceReference: dto.sourceReference,
      });
      taskIds.push(task.id);
    }

    const invoiceIds: string[] = [];
    for (const item of dto.extractedInvoices) {
      if (item.amount <= 0) continue;
      const invoice = await this.invoiceRepository.create({
        workspaceId: dto.workspaceId,
        sourceReference: dto.sourceReference,
      });
      // Add the extracted item to the invoice.
      // taskId is empty here because the invoice was generated from AI-extracted data
      // before any Tasks are created; the association is completed manually by the
      // user during the Task acceptance flow (ApproveTaskAcceptanceUseCase) or via
      // a subsequent LinkInvoiceItemToTaskUseCase once both entities exist.
      await this.invoiceRepository.addItem({
        invoiceId: invoice.id,
        amount: item.amount,
        taskId: "",
      });
      invoiceIds.push(invoice.id);
    }

    return commandSuccess(dto.contentPageId, Date.now());
  }
}
