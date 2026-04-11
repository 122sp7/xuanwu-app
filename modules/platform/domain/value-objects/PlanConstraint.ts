/**
 * PlanConstraint — Value Object
 *
 * Expresses the limitation a subscription plan places on a capability, workflow, or delivery.
 * Contains: constraint type, threshold, and enforcement mode (soft | hard).
 *
 * Used by: CapabilityEntitlementPolicy, subscription subdomain
 */

export const CONSTRAINT_TYPES = [
  "usage_limit",
  "feature_gate",
  "rate_limit",
  "storage_cap",
] as const;
export type ConstraintType = (typeof CONSTRAINT_TYPES)[number];

export type EnforcementMode = "hard" | "soft";

export interface PlanConstraint {
  readonly constraintType: ConstraintType;
  readonly featureKey: string;
  readonly threshold: number;
  readonly enforcementMode: EnforcementMode;
}

export function createPlanConstraint(input: {
  constraintType: ConstraintType;
  featureKey: string;
  threshold: number;
  enforcementMode: EnforcementMode;
}): PlanConstraint {
  if (input.threshold < 0) {
    throw new Error("PlanConstraint threshold must not be negative");
  }
  return { ...input };
}

export function isHardConstraint(constraint: PlanConstraint): boolean {
  return constraint.enforcementMode === "hard";
}

export function isExceeded(constraint: PlanConstraint, usage: number): boolean {
  return usage >= constraint.threshold;
}
