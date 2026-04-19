export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived"
  | "cancelled";

export const TASK_STATUSES = [
  "draft",
  "in_progress",
  "qa",
  "acceptance",
  "accepted",
  "archived",
  "cancelled",
] as const satisfies readonly TaskStatus[];

/**
 * TASK_NEXT defines valid forward transitions for each status.
 *
 * "in_progress" has two valid next states:
 *   - "qa"          → normal path (first submission or after QA failure)
 *   - "acceptance"  → post-rejection rework (approval was rejected; developer skips re-QA)
 *
 * The first entry in each array is the "primary" next status returned by
 * nextTaskStatus() for UI hints; canTransitionTaskStatus() accepts any listed value.
 */
const TASK_NEXT: Readonly<Record<TaskStatus, readonly TaskStatus[]>> = {
  draft: ["in_progress"],
  in_progress: ["qa", "acceptance"],
  qa: ["acceptance"],
  acceptance: ["accepted"],
  accepted: ["archived"],
  archived: [],
  cancelled: [],
};

export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean {
  return (TASK_NEXT[from] as readonly TaskStatus[]).includes(to);
}

export function nextTaskStatus(current: TaskStatus): TaskStatus | null {
  return TASK_NEXT[current][0] ?? null;
}

export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return TASK_NEXT[status].length === 0;
}
