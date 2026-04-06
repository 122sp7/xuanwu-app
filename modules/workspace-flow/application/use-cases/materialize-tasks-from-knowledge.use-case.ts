/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-knowledge.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `knowledge.page_approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice. This use case does NOT check for duplicates itself;
 * that responsibility belongs to the KnowledgeToWorkflowMaterializer process
 * manager which wraps this use case.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromKnowledgeDto } from "../dto/materialize-from-knowledge.dto";

export class MaterializeTasksFromKnowledgeUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(dto: MaterializeFromKnowledgeDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.knowledgePageId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_PAGE_REQUIRED", "knowledgePageId is required.");
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
      await this.invoiceRepository.addItem({
        invoiceId: invoice.id,
        amount: item.amount,
        taskId: "",
      });
      invoiceIds.push(invoice.id);
    }

    return commandSuccess(dto.knowledgePageId, Date.now());
  }
}