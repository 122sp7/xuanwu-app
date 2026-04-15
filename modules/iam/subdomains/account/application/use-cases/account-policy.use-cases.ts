/**
 * Account Policy Use Cases — pure application logic.
 * Token-refresh side effects are injected via TokenRefreshPort, not imported directly.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

// ─── Create Account Policy ────────────────────────────────────────────────────

export class CreateAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(input: CreatePolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.policyRepo.create(input);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId: input.accountId,
        reason: "policy:changed",
        ...(input.traceId ? { traceId: input.traceId } : {}),
      });
      return commandSuccess(policy.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to create account policy",
      );
    }
  }
}

// ─── Update Account Policy ────────────────────────────────────────────────────

export class UpdateAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(
    policyId: string,
    accountId: string,
    data: UpdatePolicyInput,
    traceId?: string,
  ): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.update(policyId, data);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "policy:changed",
        ...(traceId ? { traceId } : {}),
      });
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to update account policy",
      );
    }
  }
}

// ─── Delete Account Policy ────────────────────────────────────────────────────

export class DeleteAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(policyId: string, accountId: string): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.delete(policyId);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "policy:changed",
      });
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to delete account policy",
      );
    }
  }
}
