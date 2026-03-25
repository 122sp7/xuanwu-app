"use server";

/**
 * Account Policy Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "../../application/use-cases/account-policy.use-cases";
import { FirebaseAccountPolicyRepository } from "../../infrastructure/firebase/FirebaseAccountPolicyRepository";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

const policyRepo = new FirebaseAccountPolicyRepository();

export async function createAccountPolicy(input: CreatePolicyInput): Promise<CommandResult> {
  try {
    return await new CreateAccountPolicyUseCase(policyRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("CREATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAccountPolicy(
  policyId: string,
  accountId: string,
  data: UpdatePolicyInput,
): Promise<CommandResult> {
  try {
    return await new UpdateAccountPolicyUseCase(policyRepo).execute(policyId, accountId, data);
  } catch (err) {
    return commandFailureFrom("UPDATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAccountPolicy(
  policyId: string,
  accountId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteAccountPolicyUseCase(policyRepo).execute(policyId, accountId);
  } catch (err) {
    return commandFailureFrom("DELETE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
