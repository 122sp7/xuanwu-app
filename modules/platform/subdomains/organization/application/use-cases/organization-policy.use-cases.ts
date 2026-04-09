/**
 * Organization Policy Use Cases — org-level RBAC policy management.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrgPolicyRepository } from "../../domain/repositories/OrgPolicyRepository";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";

export class CreateOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(input: CreateOrgPolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.policyRepo.createPolicy(input);
      return commandSuccess(policy.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create org policy");
    }
  }
}

export class UpdateOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> {
    try {
      await this.policyRepo.updatePolicy(policyId, data);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update org policy");
    }
  }
}

export class DeleteOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(policyId: string): Promise<CommandResult> {
    try {
      await this.policyRepo.deletePolicy(policyId);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete org policy");
    }
  }
}
