"use server";

/**
 * Finance Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@/shared/types";
import {
  SubmitClaimUseCase,
  AdvanceFinanceStageUseCase,
  RecordPaymentReceivedUseCase,
} from "../../application/use-cases/finance.use-cases";
import { FirebaseFinanceRepository } from "../../infrastructure/firebase/FirebaseFinanceRepository";
import type { FinanceClaimLineItem } from "../../domain/entities/Finance";

const financeRepo = new FirebaseFinanceRepository();

export async function submitClaim(
  workspaceId: string,
  lineItems: FinanceClaimLineItem[],
): Promise<CommandResult> {
  try {
    return await new SubmitClaimUseCase(financeRepo).execute(workspaceId, lineItems);
  } catch (err) {
    return commandFailureFrom("SUBMIT_CLAIM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function advanceFinanceStage(workspaceId: string): Promise<CommandResult> {
  try {
    return await new AdvanceFinanceStageUseCase(financeRepo).execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("ADVANCE_STAGE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function recordPaymentReceived(
  workspaceId: string,
  amount: number,
  receivedAt: string,
): Promise<CommandResult> {
  try {
    return await new RecordPaymentReceivedUseCase(financeRepo).execute(workspaceId, amount, receivedAt);
  } catch (err) {
    return commandFailureFrom("RECORD_PAYMENT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
