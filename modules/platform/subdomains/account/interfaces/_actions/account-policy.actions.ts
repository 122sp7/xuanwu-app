"use server";

/**
 * Account Policy Server Actions — thin adapter: Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { accountService } from "../../infrastructure/account-service";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

export async function createAccountPolicy(input: CreatePolicyInput): Promise<CommandResult> {
  try {
    return await accountService.createPolicy(input);
  } catch (err) {
    return commandFailureFrom("CREATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAccountPolicy(
  policyId: string,
  accountId: string,
  data: UpdatePolicyInput,
  traceId?: string,
): Promise<CommandResult> {
  try {
    return await accountService.updatePolicy(policyId, accountId, data, traceId);
  } catch (err) {
    return commandFailureFrom("UPDATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAccountPolicy(
  policyId: string,
  accountId: string,
): Promise<CommandResult> {
  try {
    return await accountService.deletePolicy(policyId, accountId);
  } catch (err) {
    return commandFailureFrom("DELETE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
