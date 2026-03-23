"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateInvoiceEntityInput } from "../../domain/repositories/FinanceRepository";
import {
  AdvanceInvoiceUseCase,
  CreateInvoiceUseCase,
  DeleteInvoiceUseCase,
} from "../../application/use-cases/finance.use-cases";
import { FirebaseInvoiceRepository } from "../../infrastructure/firebase/FirebaseFinanceRepository";

function makeRepo() {
  return new FirebaseInvoiceRepository();
}

export async function createInvoice(input: CreateInvoiceEntityInput): Promise<CommandResult> {
  try {
    return await new CreateInvoiceUseCase(makeRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("INV_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function advanceInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new AdvanceInvoiceUseCase(makeRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("INV_ADVANCE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new DeleteInvoiceUseCase(makeRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("INV_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
