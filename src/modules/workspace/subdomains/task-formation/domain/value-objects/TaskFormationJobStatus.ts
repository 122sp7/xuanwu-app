export type TaskFormationJobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";

export const TASK_FORMATION_JOB_STATUSES = [
  "queued", "running", "partially_succeeded", "succeeded", "failed", "cancelled",
] as const satisfies readonly TaskFormationJobStatus[];
