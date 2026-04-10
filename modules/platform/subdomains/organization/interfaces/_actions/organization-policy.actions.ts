"use server";

/**
 * Organization Policy Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { organizationService } from "../../infrastructure/organization-service";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";

export async function createOrgPolicy(input: CreateOrgPolicyInput): Promise<CommandResult> {
  try { return await organizationService.createOrgPolicy(input); }
  catch (err) { return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateOrgPolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> {
  try { return await organizationService.updateOrgPolicy(policyId, data); }
  catch (err) { return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteOrgPolicy(policyId: string): Promise<CommandResult> {
  try { return await organizationService.deleteOrgPolicy(policyId); }
  catch (err) { return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}
