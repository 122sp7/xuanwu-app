"use server";

/**
 * Account Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "../../application/use-cases/account.use-cases";
import { FirebaseAccountRepository } from "../../infrastructure/firebase/FirebaseAccountRepository";
import { FirebaseTokenRefreshRepository } from "@/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";

const accountRepo = new FirebaseAccountRepository();
const tokenRefreshRepo = new FirebaseTokenRefreshRepository();

export async function createUserAccount(
  userId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try {
    return await new CreateUserAccountUseCase(accountRepo).execute(userId, name, email);
  } catch (err) {
    return commandFailureFrom("CREATE_USER_ACCOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<CommandResult> {
  try {
    return await new UpdateUserProfileUseCase(accountRepo).execute(userId, data);
  } catch (err) {
    return commandFailureFrom("UPDATE_USER_PROFILE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function creditWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult> {
  try {
    return await new CreditWalletUseCase(accountRepo).execute(accountId, amount, description);
  } catch (err) {
    return commandFailureFrom("WALLET_CREDIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function debitWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult> {
  try {
    return await new DebitWalletUseCase(accountRepo).execute(accountId, amount, description);
  } catch (err) {
    return commandFailureFrom("WALLET_DEBIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function assignAccountRole(
  accountId: string,
  role: OrganizationRole,
  grantedBy: string,
  traceId?: string,
): Promise<CommandResult> {
  try {
    // Pass tokenRefreshRepo so TOKEN_REFRESH_SIGNAL is emitted after role change [S6].
    return await new AssignAccountRoleUseCase(accountRepo, tokenRefreshRepo).execute(
      accountId,
      role,
      grantedBy,
      traceId,
    );
  } catch (err) {
    return commandFailureFrom("ASSIGN_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function revokeAccountRole(accountId: string): Promise<CommandResult> {
  try {
    return await new RevokeAccountRoleUseCase(accountRepo, tokenRefreshRepo).execute(accountId);
  } catch (err) {
    return commandFailureFrom("REVOKE_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
