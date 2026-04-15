"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeInvoiceRepo } from "../../api/factories";
import { CreateInvoiceUseCase } from "../../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../../application/use-cases/close-invoice.use-case";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";

export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult> {
  try {
    return await new CreateInvoiceUseCase(makeInvoiceRepo()).execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new AddInvoiceItemUseCase(makeInvoiceRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_ADD_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new UpdateInvoiceItemUseCase(makeInvoiceRepo()).execute(invoiceItemId, dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_UPDATE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new RemoveInvoiceItemUseCase(makeInvoiceRepo()).execute(dto.invoiceId, dto.invoiceItemId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REMOVE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new SubmitInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new ReviewInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REVIEW_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new ApproveInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new RejectInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REJECT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPayInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new PayInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_PAY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new CloseInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
