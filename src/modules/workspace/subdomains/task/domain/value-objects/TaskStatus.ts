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

const TASK_NEXT: Readonly<Record<TaskStatus, TaskStatus | null>> = {
  draft: "in_progress",
  in_progress: "qa",
  qa: "acceptance",
  acceptance: "accepted",
  accepted: "archived",
  archived: null,
  cancelled: null,
};

export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_NEXT[from] === to;
}

export function nextTaskStatus(current: TaskStatus): TaskStatus | null {
  return TASK_NEXT[current];
}

export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return TASK_NEXT[status] === null;
}
