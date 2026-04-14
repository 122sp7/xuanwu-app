/**
 * PermissionDecision — Value Object / Decision Object
 *
 * The outcome of a permission evaluation.
 * Possible outcomes: allow | deny | conditional_allow | escalate
 */

export type PermissionOutcome = "allow" | "deny" | "conditional_allow" | "escalate";

export interface PermissionDecision {
  readonly outcome: PermissionOutcome;
  readonly reason: string;
  readonly conditions?: readonly string[];
  readonly evaluatedAt: string;
}

export function allowDecision(reason: string): PermissionDecision {
  return { outcome: "allow", reason, evaluatedAt: new Date().toISOString() };
}

export function denyDecision(reason: string): PermissionDecision {
  return { outcome: "deny", reason, evaluatedAt: new Date().toISOString() };
}

export function conditionalAllowDecision(
  reason: string,
  conditions: string[],
): PermissionDecision {
  return {
    outcome: "conditional_allow",
    reason,
    conditions,
    evaluatedAt: new Date().toISOString(),
  };
}

export function escalateDecision(reason: string): PermissionDecision {
  return { outcome: "escalate", reason, evaluatedAt: new Date().toISOString() };
}

export function isAllowed(decision: PermissionDecision): boolean {
  return decision.outcome === "allow" || decision.outcome === "conditional_allow";
}
