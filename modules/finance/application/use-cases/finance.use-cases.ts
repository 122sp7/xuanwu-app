/**
 * Finance Use Cases — pure business workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@/shared/types";
import type { FinanceRepository } from "../../domain/repositories/FinanceRepository";
import type { FinanceClaimLineItem } from "../../domain/entities/Finance";
import { canAdvanceStage, nextStage, calculateTotalClaim } from "../../domain/entities/Finance";

export class SubmitClaimUseCase {
  constructor(private readonly financeRepo: FinanceRepository) {}

  async execute(
    workspaceId: string,
    lineItems: FinanceClaimLineItem[],
  ): Promise<CommandResult> {
    try {
      const finance = await this.financeRepo.findByWorkspaceId(workspaceId);
      if (!finance) {
        return commandFailureFrom("FINANCE_NOT_FOUND", `Finance aggregate for workspace ${workspaceId} not found`);
      }
      if (finance.stage !== "claim-preparation") {
        return commandFailureFrom("FINANCE_INVALID_STAGE", `Cannot submit claim from stage: ${finance.stage}`);
      }
      if (lineItems.length === 0) {
        return commandFailureFrom("FINANCE_EMPTY_CLAIM", "Cannot submit an empty claim");
      }
      const totalAmount = calculateTotalClaim(lineItems);
      if (totalAmount <= 0) {
        return commandFailureFrom("FINANCE_INVALID_AMOUNT", "Claim total must be positive");
      }
      await this.financeRepo.submitClaim(workspaceId, lineItems);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SUBMIT_CLAIM_FAILED",
        err instanceof Error ? err.message : "Failed to submit claim",
      );
    }
  }
}

export class AdvanceFinanceStageUseCase {
  constructor(private readonly financeRepo: FinanceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    try {
      const finance = await this.financeRepo.findByWorkspaceId(workspaceId);
      if (!finance) {
        return commandFailureFrom("FINANCE_NOT_FOUND", `Finance aggregate not found`);
      }
      if (!canAdvanceStage(finance.stage)) {
        return commandFailureFrom(
          "FINANCE_STAGE_TERMINAL",
          `Cannot advance from terminal stage: ${finance.stage}`,
        );
      }
      const next = nextStage(finance.stage);
      await this.financeRepo.advanceStage(workspaceId, next);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ADVANCE_STAGE_FAILED",
        err instanceof Error ? err.message : "Failed to advance finance stage",
      );
    }
  }
}

export class RecordPaymentReceivedUseCase {
  constructor(private readonly financeRepo: FinanceRepository) {}

  async execute(
    workspaceId: string,
    amount: number,
    receivedAt: string,
  ): Promise<CommandResult> {
    try {
      if (amount <= 0) {
        return commandFailureFrom("FINANCE_INVALID_AMOUNT", "Payment amount must be positive");
      }
      const finance = await this.financeRepo.findByWorkspaceId(workspaceId);
      if (!finance) {
        return commandFailureFrom("FINANCE_NOT_FOUND", "Finance aggregate not found");
      }
      if (finance.stage !== "payment-term") {
        return commandFailureFrom(
          "FINANCE_INVALID_STAGE",
          `Cannot record payment from stage: ${finance.stage}`,
        );
      }
      await this.financeRepo.recordPaymentReceived(workspaceId, amount, receivedAt);
      return commandSuccess(workspaceId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RECORD_PAYMENT_FAILED",
        err instanceof Error ? err.message : "Failed to record payment",
      );
    }
  }
}
