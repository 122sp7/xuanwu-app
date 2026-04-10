/**
 * @module workspace-flow/domain/services
 * @file issue-transition-policy.ts
 * @description Pure domain service encapsulating allowed Issue status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with additional guard conditions as business rules evolve
 */

import { canTransitionIssueStatus, type IssueStatus } from "../value-objects/IssueStatus";

export type IssueTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an issue lifecycle transition is permitted.
 *
 * @param from - Current issue status
 * @param to   - Requested next status
 * @returns IssueTransitionResult indicating whether the transition is allowed
 */
export function evaluateIssueTransition(
  from: IssueStatus,
  to: IssueStatus,
): IssueTransitionResult {
  if (!canTransitionIssueStatus(from, to)) {
    return {
      allowed: false,
      reason: `Issue transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
 
