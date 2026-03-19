import type { CalendarSlot } from "../value-objects/Scheduling";
import type { ScheduleStatus } from "../value-objects/WorkflowStatuses";

export interface Schedule {
  readonly scheduleId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly assigneeAccountUserId: string;
  readonly calendarSlot: CalendarSlot;
  readonly loadUnits: number;
  readonly status: ScheduleStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateScheduleInput {
  readonly scheduleId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly assigneeAccountUserId: string;
  readonly calendarSlot: CalendarSlot;
  readonly loadUnits: number;
  readonly nowISO: string;
}

const SCHEDULE_STATUS_TRANSITIONS: Record<ScheduleStatus, readonly ScheduleStatus[]> = {
  planned: ["reserved", "active", "cancelled", "conflicted"],
  reserved: ["active", "cancelled", "conflicted"],
  active: ["completed", "cancelled", "conflicted"],
  conflicted: ["planned", "cancelled"],
  cancelled: [],
  completed: [],
} as const;

export function createSchedule(input: CreateScheduleInput): Schedule {
  return {
    scheduleId: input.scheduleId,
    assignmentId: input.assignmentId,
    taskId: input.taskId,
    assigneeAccountUserId: input.assigneeAccountUserId,
    calendarSlot: input.calendarSlot,
    loadUnits: input.loadUnits,
    status: "planned",
    createdAtISO: input.nowISO,
    updatedAtISO: input.nowISO,
  };
}

export function transitionScheduleStatus(
  schedule: Schedule,
  nextStatus: ScheduleStatus,
  nowISO: string,
): Schedule {
  const allowed = SCHEDULE_STATUS_TRANSITIONS[schedule.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `Invalid schedule transition: ${schedule.status} -> ${nextStatus}. Allowed: ${allowed.join(", ") || "(none)"}`,
    );
  }

  return {
    ...schedule,
    status: nextStatus,
    updatedAtISO: nowISO,
  };
}
