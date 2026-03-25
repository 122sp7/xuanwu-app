/**
 * Account Policy Use Cases — pure business workflows.
 * Per [S6]: account policy changes trigger CUSTOM_CLAIMS refresh (via TOKEN_REFRESH_SIGNAL).
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
import { identityApi } from "@/modules/identity/api";

// ─── Create Account Policy ────────────────────────────────────────────────────

export class CreateAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
  ) {}

  async execute(input: CreatePolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.policyRepo.create(input);
      // [S6] Emit token refresh signal after policy change so frontend refreshes claims.
      await identityApi.emitTokenRefreshSignal({
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
  ) {}

  async execute(
    policyId: string,
    accountId: string,
    data: UpdatePolicyInput,
  ): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.update(policyId, data);
      // [S6] Emit refresh signal after policy change.
      await identityApi.emitTokenRefreshSignal({
        accountId,
        reason: "policy:changed",
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
  ) {}

  async execute(policyId: string, accountId: string): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.delete(policyId);
      // [S6] Emit refresh signal after policy deletion.
      await identityApi.emitTokenRefreshSignal({
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
