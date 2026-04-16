import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AccountRepository, OrganizationRole, UpdateProfileInput } from "../../domain/repositories/AccountRepository";
import type { AccountQueryRepository, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { AccountProfile, UpdateAccountProfileInput } from "../../domain/entities/AccountProfile";
import { createUpdateAccountProfileInput } from "../../domain/entities/AccountProfile";

// ─── Create User Account ──────────────────────────────────────────────────────

export class CreateUserAccountUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, name: string, email: string): Promise<CommandResult> {
    try {
      await this.accountRepo.save({
        id: userId,
        name,
        email,
        accountType: "user",
        photoURL: null,
        bio: null,
        status: "active",
        walletBalance: 0,
        createdAtISO: new Date().toISOString(),
        updatedAtISO: new Date().toISOString(),
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

// ─── Update User Profile ──────────────────────────────────────────────────────

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

  async execute(accountId: string, amount: number, description: string): Promise<CommandResult> {
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

  async execute(accountId: string, amount: number, description: string): Promise<CommandResult> {
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

// ─── Assign Account Role ──────────────────────────────────────────────────────

export class AssignAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
    traceId?: string,
  ): Promise<CommandResult> {
    try {
      const record = await this.accountRepo.assignRole(accountId, role, grantedBy);
      await this.tokenRefresh.emitTokenRefreshSignal({
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

// ─── Revoke Account Role ──────────────────────────────────────────────────────

export class RevokeAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(accountId: string): Promise<CommandResult> {
    try {
      await this.accountRepo.revokeRole(accountId);
      await this.tokenRefresh.emitTokenRefreshSignal({
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

// ─── Get Account Profile ──────────────────────────────────────────────────────

export class GetAccountProfileUseCase {
  constructor(private readonly repo: AccountQueryRepository) {}

  async execute(actorId: string): Promise<AccountProfile | null> {
    return this.repo.getAccountProfile(actorId);
  }
}

// ─── Subscribe Account Profile ────────────────────────────────────────────────

export class SubscribeAccountProfileUseCase {
  constructor(private readonly repo: AccountQueryRepository) {}

  execute(actorId: string, onUpdate: (profile: AccountProfile | null) => void): Unsubscribe {
    return this.repo.subscribeToAccountProfile(actorId, onUpdate);
  }
}

// ─── Update Account Profile ───────────────────────────────────────────────────

export class UpdateAccountProfileUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(actorId: string, input: UpdateAccountProfileInput): Promise<CommandResult> {
    try {
      const validatedInput = createUpdateAccountProfileInput(input);
      await this.accountRepo.updateAccountProfile(actorId, validatedInput);
      return commandSuccess(actorId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ACCOUNT_PROFILE_FAILED",
        err instanceof Error ? err.message : "Failed to update account profile",
      );
    }
  }
}
