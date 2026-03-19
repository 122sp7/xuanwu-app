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
