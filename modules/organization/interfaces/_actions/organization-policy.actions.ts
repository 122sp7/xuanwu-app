"use server";

/**
 * Module: organization
 * Layer: interfaces/_actions
 * Purpose: Organization policy server actions — create, update, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../../application/use-cases/organization-policy.use-cases";
import { FirebaseOrgPolicyRepository } from "../../infrastructure/firebase/FirebaseOrgPolicyRepository";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";

const policyRepo = new FirebaseOrgPolicyRepository();

export async function createOrgPolicy(input: CreateOrgPolicyInput): Promise<CommandResult> {
  try {
    return await new CreateOrgPolicyUseCase(policyRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateOrgPolicy(
  policyId: string,
  data: UpdateOrgPolicyInput,
): Promise<CommandResult> {
  try {
    return await new UpdateOrgPolicyUseCase(policyRepo).execute(policyId, data);
  } catch (err) {
    return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteOrgPolicy(policyId: string): Promise<CommandResult> {
  try {
    return await new DeleteOrgPolicyUseCase(policyRepo).execute(policyId);
  } catch (err) {
    return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
