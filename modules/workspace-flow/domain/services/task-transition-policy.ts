/**
 * @module workspace-flow/domain/services
 * @file task-transition-policy.ts
 * @description Pure domain service encapsulating allowed Task status transitions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with multi-branch transitions if workflow rules evolve
 */

import { canTransitionTaskStatus, type TaskStatus } from "../value-objects/TaskStatus";

export type TaskTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether a task lifecycle transition is permitted.
 *
 * @param from - Current task status
 * @param to   - Requested next status
 * @returns TaskTransitionResult indicating whether the transition is allowed
 */
export function evaluateTaskTransition(
  from: TaskStatus,
  to: TaskStatus,
): TaskTransitionResult {
  if (!canTransitionTaskStatus(from, to)) {
    return {
      allowed: false,
      reason: `Task transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
