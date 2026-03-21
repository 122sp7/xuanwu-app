/**
 * Organization Policy Use Cases — pure business workflows.
 * Org policy changes flow through event bus to update workspace org-policy cache downstream.
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";

// ─── Create Org Policy ────────────────────────────────────────────────────────

export class CreateOrgPolicyUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: CreateOrgPolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.orgRepo.createPolicy(input);
      return commandSuccess(policy.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ORG_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to create org policy",
      );
    }
  }
}

// ─── Update Org Policy ────────────────────────────────────────────────────────

export class UpdateOrgPolicyUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> {
    try {
      await this.orgRepo.updatePolicy(policyId, data);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ORG_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to update org policy",
      );
    }
  }
}

// ─── Delete Org Policy ────────────────────────────────────────────────────────

export class DeleteOrgPolicyUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(policyId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.deletePolicy(policyId);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_ORG_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to delete org policy",
      );
    }
  }
}
