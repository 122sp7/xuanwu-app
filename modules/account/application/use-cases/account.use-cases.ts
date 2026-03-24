/**
 * Account Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";
import { identityApi } from "@/modules/identity/api";

// ─── Create Account ───────────────────────────────────────────────────────────

export class CreateUserAccountUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, name: string, email: string): Promise<CommandResult> {
    try {
      await this.accountRepo.save({
        id: userId,
        name,
        email,
        accountType: "user",
      });
      return commandSuccess(userId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_USER_ACCOUNT_FAILED",
        err instanceof Error ? err.message : "Failed to create user account",
      );
    }
  }
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export class UpdateUserProfileUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, data: UpdateProfileInput): Promise<CommandResult> {
    try {
      await this.accountRepo.updateProfile(userId, data);
      return commandSuccess(userId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_USER_PROFILE_FAILED",
        err instanceof Error ? err.message : "Failed to update user profile",
      );
    }
  }
}

// ─── Credit Wallet ────────────────────────────────────────────────────────────

export class CreditWalletUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<CommandResult> {
    try {
      if (amount <= 0) {
        return commandFailureFrom("WALLET_INVALID_AMOUNT", "Credit amount must be positive");
      }
      const tx = await this.accountRepo.creditWallet(accountId, amount, description);
      return commandSuccess(tx.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WALLET_CREDIT_FAILED",
        err instanceof Error ? err.message : "Failed to credit wallet",
      );
    }
  }
}

// ─── Debit Wallet ─────────────────────────────────────────────────────────────

export class DebitWalletUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<CommandResult> {
    try {
      if (amount <= 0) {
        return commandFailureFrom("WALLET_INVALID_AMOUNT", "Debit amount must be positive");
      }
      const balance = await this.accountRepo.getWalletBalance(accountId);
      if (balance < amount) {
        return commandFailureFrom("WALLET_INSUFFICIENT_FUNDS", "Insufficient wallet balance");
      }
      const tx = await this.accountRepo.debitWallet(accountId, amount, description);
      return commandSuccess(tx.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WALLET_DEBIT_FAILED",
        err instanceof Error ? err.message : "Failed to debit wallet",
      );
    }
  }
}

// ─── Assign Role ──────────────────────────────────────────────────────────────

export class AssignAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
  ) {}

  async execute(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
    traceId?: string,
  ): Promise<CommandResult> {
    try {
      const record = await this.accountRepo.assignRole(accountId, role, grantedBy);
      // [S6] Emit TOKEN_REFRESH_SIGNAL so frontend force-refreshes Custom Claims.
      await identityApi.emitTokenRefreshSignal({
        accountId,
        reason: "role:changed",
        ...(traceId ? { traceId } : {}),
      });
      return commandSuccess(record.accountId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ASSIGN_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to assign role",
      );
    }
  }
}

// ─── Revoke Role ──────────────────────────────────────────────────────────────

export class RevokeAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
  ) {}

  async execute(accountId: string): Promise<CommandResult> {
    try {
      await this.accountRepo.revokeRole(accountId);
      // [S6] Emit TOKEN_REFRESH_SIGNAL after role revocation.
      await identityApi.emitTokenRefreshSignal({
        accountId,
        reason: "role:changed",
      });
      return commandSuccess(accountId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "REVOKE_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to revoke role",
      );
    }
  }
}
