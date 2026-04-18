"use server";

import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { CreateInvoiceSchema, TransitionInvoiceSchema } from "../../../subdomains/settlement/application/dto/SettlementDTO";
import { createClientSettlementUseCases } from "../../outbound/firebase-composition";
import type { InvoiceSnapshot } from "../../../subdomains/settlement/domain/entities/Invoice";

// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, workspaceId membership is
// not verified here — tracked as GAP-05.

export async function createInvoiceAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const { workspaceId } = CreateInvoiceSchema.parse(rawInput);
    const { createInvoice } = createClientSettlementUseCases();
    return createInvoice.execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("SETTLEMENT_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function transitionInvoiceStatusAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const { invoiceId, to } = TransitionInvoiceSchema.parse(rawInput);
    const { transitionInvoiceStatus } = createClientSettlementUseCases();
    return transitionInvoiceStatus.execute(invoiceId, to);
  } catch (err) {
    return commandFailureFrom("SETTLEMENT_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listInvoicesByWorkspaceAction(workspaceId: string): Promise<InvoiceSnapshot[]> {
  try {
    const { listInvoicesByWorkspace } = createClientSettlementUseCases();
    return listInvoicesByWorkspace(workspaceId);
  } catch {
    return [];
  }
}
