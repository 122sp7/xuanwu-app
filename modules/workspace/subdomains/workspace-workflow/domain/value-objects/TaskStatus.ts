/**
 * @module workspace-flow/domain/value-objects
 * @file TaskStatus.ts
 * @description Task lifecycle status union, transition table, and pure helper functions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";

/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
export const TASK_STATUSES = [
  "draft",
  "in_progress",
  "qa",
  "acceptance",
  "accepted",
  "archived",
] as const satisfies readonly TaskStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Maps each status to its single valid successor (null = terminal).
 *
 * The flow is intentionally forward-only.
 * draft → in_progress (ASSIGN)
 * in_progress → qa (SUBMIT_QA)
 * qa → acceptance (PASS_QA)
 * acceptance → accepted (APPROVE_ACCEPTANCE)
 * accepted → archived (ARCHIVE)
 */
const TASK_NEXT: Readonly<Record<TaskStatus, TaskStatus | null>> = {
  draft: "in_progress",
  in_progress: "qa",
  qa: "acceptance",
  acceptance: "accepted",
  accepted: "archived",
  archived: null,
};

/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_NEXT[from] === to;
}

/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(current: TaskStatus): TaskStatus | null {
  return TASK_NEXT[current];
}

/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return TASK_NEXT[status] === null;
}
 
