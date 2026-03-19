export const REQUEST_STATUSES = [
  "draft",
  "submitted",
  "under-review",
  "accepted",
  "rejected",
  "cancelled",
  "closed",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const TASK_STATUSES = [
  "open",
  "matching",
  "assignable",
  "assigned",
  "scheduled",
  "completed",
  "cancelled",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const ASSIGNMENT_STATUSES = [
  "pending-review",
  "proposed",
  "accepted",
  "rejected",
  "cancelled",
  "completed",
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const SCHEDULE_STATUSES = [
  "planned",
  "reserved",
  "active",
  "completed",
  "cancelled",
  "conflicted",
] as const;
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];
