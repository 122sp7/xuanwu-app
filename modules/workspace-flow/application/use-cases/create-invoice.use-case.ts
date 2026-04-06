/**
 * @module workspace-flow/application/use-cases
 * @file create-invoice.use-case.ts
 * @description Use case: Create a new invoice for a workspace.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceCreatedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    if (!workspaceId.trim()) {
      return commandFailureFrom("WF_INVOICE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    const invoice = await this.invoiceRepository.create({ workspaceId: workspaceId.trim() });
    return commandSuccess(invoice.id, Date.now());
  }
}
