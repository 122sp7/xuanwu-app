/**
 * Module: task
 * Layer: domain/value-object
 * Purpose: Task lifecycle status enum and pure state-machine transition helpers.
 *
 * Status flow (forward-only main path):
 *   draft → in_progress → qa → acceptance → accepted → archived
 *
 * Regression / anomaly is handled by the Issue domain — Task status never
 * moves backwards.  Use `canTransitionTask` as a domain guard before persisting.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type TaskLifecycleStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";

/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
export const TASK_LIFECYCLE_STATUSES = [
  "draft",
  "in_progress",
  "qa",
  "acceptance",
  "accepted",
  "archived",
] as const satisfies readonly TaskLifecycleStatus[];

// ── Transition table ───────────────────────────────────────────────────────────

/**
 * Maps each status to its single valid successor (null = terminal).
 *
 * The flow is intentionally forward-only.  When a regression is discovered
 * (e.g. a QA tester finds a defect), the caller MUST open an Issue via the
 * Issue domain instead of reversing the Task status.  This keeps the Task
 * state machine linear and auditable, while the Issue domain manages the
 * separate fix/retest lifecycle.
 */
const TASK_NEXT: Readonly<Record<TaskLifecycleStatus, TaskLifecycleStatus | null>> = {
  draft: "in_progress",
  in_progress: "qa",
  qa: "acceptance",
  acceptance: "accepted",
  accepted: "archived",
  archived: null,
};

/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTask(
  from: TaskLifecycleStatus,
  to: TaskLifecycleStatus,
): boolean {
  return TASK_NEXT[from] === to;
}

/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(
  current: TaskLifecycleStatus,
): TaskLifecycleStatus | null {
  return TASK_NEXT[current];
}

/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskLifecycleStatus): boolean {
  return TASK_NEXT[status] === null;
}
