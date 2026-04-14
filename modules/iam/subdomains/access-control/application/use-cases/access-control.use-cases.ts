import { v4 as uuid } from "@lib-uuid";
/**
 * Access-Control Use Cases — pure application logic.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { AccessPolicy } from "../../domain/aggregates/AccessPolicy";
import {
  allowDecision,
  denyDecision,
} from "../../../../domain/value-objects/PermissionDecision";
import type { AccessPolicyRepository } from "../../domain/repositories/AccessPolicyRepository";
import type { SubjectRef } from "../../domain/value-objects/SubjectRef";
import type { ResourceRef } from "../../domain/value-objects/ResourceRef";
import type { PolicyEffect } from "../../domain/value-objects/PolicyEffect";

// ─── Evaluate Permission ──────────────────────────────────────────────────────

export class EvaluatePermissionUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(input: {
    subjectId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
  }): Promise<CommandResult> {
    try {
      const policies = await this.repo.findActiveBySubjectAndResource(
        input.subjectId,
        input.resourceType,
        input.resourceId,
      );

      // Explicit deny takes priority (deny-override semantics)
      const hasDeny = policies.some(
        (p) => p.effect === "deny" && p.actions.includes(input.action),
      );
      if (hasDeny) {
        return commandSuccess(JSON.stringify(denyDecision("Explicit deny policy matched")), Date.now());
      }

      const hasAllow = policies.some(
        (p) => p.effect === "allow" && p.actions.includes(input.action),
      );
      if (hasAllow) {
        return commandSuccess(JSON.stringify(allowDecision("Allow policy matched")), Date.now());
      }

      return commandSuccess(JSON.stringify(denyDecision("No matching allow policy")), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "EVALUATE_PERMISSION_FAILED",
        err instanceof Error ? err.message : "Failed to evaluate permission",
      );
    }
  }
}

// ─── Create Access Policy ─────────────────────────────────────────────────────

export class CreateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(input: {
    subjectRef: SubjectRef;
    resourceRef: ResourceRef;
    actions: string[];
    effect: PolicyEffect;
    conditions?: string[];
  }): Promise<CommandResult> {
    try {
      const id = uuid();
      const policy = AccessPolicy.create(id, input);
      await this.repo.save(policy.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to create access policy",
      );
    }
  }
}

// ─── Update Access Policy ─────────────────────────────────────────────────────

export class UpdateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(
    policyId: string,
    input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] },
  ): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(policyId);
      if (!snapshot) {
        return commandFailureFrom("POLICY_NOT_FOUND", `AccessPolicy ${policyId} not found`);
      }
      const policy = AccessPolicy.reconstitute(snapshot);
      policy.update(input);
      await this.repo.update(policy.getSnapshot());
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to update access policy",
      );
    }
  }
}

// ─── Delete (Deactivate) Access Policy ───────────────────────────────────────

export class DeactivateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(policyId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(policyId);
      if (!snapshot) {
        return commandFailureFrom("POLICY_NOT_FOUND", `AccessPolicy ${policyId} not found`);
      }
      const policy = AccessPolicy.reconstitute(snapshot);
      policy.deactivate();
      await this.repo.update(policy.getSnapshot());
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DEACTIVATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to deactivate access policy",
      );
    }
  }
}
