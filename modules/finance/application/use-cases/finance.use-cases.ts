/**
 * Module: finance
 * Layer: application/use-cases
 * Purpose: Invoice lifecycle use-cases.
 *
 * Replaces old SubmitClaimUseCase / AdvanceFinanceStageUseCase / RecordPaymentReceivedUseCase.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IInvoiceRepository, CreateInvoiceEntityInput } from "../../domain/repositories/FinanceRepository";
import type { Invoice } from "../../domain/entities/Invoice";
import { canTransitionInvoice, nextInvoiceStatus, isInvoiceMutable } from "../../domain/value-objects/invoice-state";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(input: CreateInvoiceEntityInput): Promise<CommandResult> {
    const tenantId = input.tenantId.trim();
    const teamId = input.teamId.trim();
    const workspaceId = input.workspaceId.trim();

    if (!tenantId) return commandFailureFrom("INV_TENANT_REQUIRED", "Tenant is required.");
    if (!teamId) return commandFailureFrom("INV_TEAM_REQUIRED", "Team is required.");
    if (!workspaceId) return commandFailureFrom("INV_WORKSPACE_REQUIRED", "Workspace is required.");

    const invoice = await this.invoiceRepository.create({ ...input, tenantId, teamId, workspaceId });
    return commandSuccess(invoice.id, Date.now());
  }
}

export class AdvanceInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    const normalizedId = invoiceId.trim();
    if (!normalizedId) return commandFailureFrom("INV_ID_REQUIRED", "Invoice id is required.");

    const invoice = await this.invoiceRepository.findById(normalizedId);
    if (!invoice) return commandFailureFrom("INV_NOT_FOUND", "Invoice not found.");

    const next = nextInvoiceStatus(invoice.status);
    if (!next) {
      return commandFailureFrom("INV_TERMINAL", `Invoice is already at terminal status: ${invoice.status}.`);
    }
    if (!canTransitionInvoice(invoice.status, next)) {
      return commandFailureFrom("INV_INVALID_TRANSITION", `Cannot advance from "${invoice.status}".`);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(normalizedId, next, nowISO);
    if (!updated) return commandFailureFrom("INV_NOT_FOUND", "Invoice not found after transition.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    const normalizedId = invoiceId.trim();
    if (!normalizedId) return commandFailureFrom("INV_ID_REQUIRED", "Invoice id is required.");

    const invoice = await this.invoiceRepository.findById(normalizedId);
    if (!invoice) return commandFailureFrom("INV_NOT_FOUND", "Invoice not found.");
    if (!isInvoiceMutable(invoice.status)) {
      return commandFailureFrom("INV_NOT_MUTABLE", "Only draft invoices can be deleted.");
    }

    await this.invoiceRepository.delete(normalizedId);
    return commandSuccess(normalizedId, Date.now());
  }
}

export class ListInvoicesUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(workspaceId: string): Promise<Invoice[]> {
    const normalizedId = workspaceId.trim();
    if (!normalizedId) return [];
    return this.invoiceRepository.findByWorkspaceId(normalizedId);
  }
}
