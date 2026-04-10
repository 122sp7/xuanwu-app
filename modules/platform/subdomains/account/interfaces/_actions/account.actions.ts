"use server";

/**
 * Account Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { accountService } from "../account-service";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";

export async function createUserAccount(
  userId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try {
    return await accountService.createUserAccount(userId, name, email);
  } catch (err) {
    return commandFailureFrom("CREATE_USER_ACCOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<CommandResult> {
  try {
    return await accountService.updateUserProfile(userId, data);
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
    return await accountService.creditWallet(accountId, amount, description);
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
    return await accountService.debitWallet(accountId, amount, description);
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
    return await accountService.assignRole(accountId, role, grantedBy, traceId);
  } catch (err) {
    return commandFailureFrom("ASSIGN_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function revokeAccountRole(accountId: string): Promise<CommandResult> {
  try {
    return await accountService.revokeRole(accountId);
  } catch (err) {
    return commandFailureFrom("REVOKE_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
