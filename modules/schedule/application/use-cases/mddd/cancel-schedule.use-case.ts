import { commandFailure, commandSuccess, type CommandResult } from "@/shared/types";
import {
  transitionAssignmentStatus,
  transitionScheduleStatus,
  transitionTaskStatus,
  type Assignment,
  type Schedule,
  type ScheduleDomainEvent,
  type Task,
} from "../../../domain/mddd";
import {
  SCHEDULE_MDDD_ERROR_CODES,
  createScheduleMdddDomainError,
} from "../../../domain/mddd/errors";
import type {
  ScheduleMdddAssignmentRepository,
  ScheduleMdddProjectionRepository,
  ScheduleMdddScheduleRepository,
  ScheduleMdddTaskRepository,
} from "../../../domain/mddd/repositories";

export interface CancelScheduleInput {
  readonly scheduleId: string;
  readonly reason?: string;
}

export interface CancelScheduleResult {
  readonly command: CommandResult;
  readonly schedule?: Schedule;
  readonly assignment?: Assignment;
  readonly task?: Task;
  readonly events: readonly ScheduleDomainEvent[];
}

export class CancelScheduleUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleMdddScheduleRepository,
    private readonly assignmentRepository: ScheduleMdddAssignmentRepository,
    private readonly taskRepository: ScheduleMdddTaskRepository,
    private readonly projectionRepository: ScheduleMdddProjectionRepository,
  ) {}

  async execute(input: CancelScheduleInput): Promise<CancelScheduleResult> {
    const nowISO = new Date().toISOString();
    const events: ScheduleDomainEvent[] = [];

    const schedule = await this.scheduleRepository.findById(input.scheduleId);
    if (!schedule) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.SCHEDULE_NOT_FOUND,
            "Schedule not found.",
            { scheduleId: input.scheduleId },
          ),
        ),
        events,
      };
    }

    if (!["planned", "reserved", "active", "conflicted"].includes(schedule.status)) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.SCHEDULE_CANCEL_INVALID,
            `Schedule status ${schedule.status} cannot be cancelled.`,
            { scheduleId: schedule.scheduleId, status: schedule.status },
          ),
        ),
        schedule,
        events,
      };
    }

    const cancelledSchedule = transitionScheduleStatus(schedule, "cancelled", nowISO);
    await this.scheduleRepository.save(cancelledSchedule);

    const assignment = await this.assignmentRepository.findById(cancelledSchedule.assignmentId);
    if (!assignment) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.ASSIGNMENT_NOT_FOUND,
            "Assignment not found for schedule.",
            { assignmentId: cancelledSchedule.assignmentId },
          ),
        ),
        schedule: cancelledSchedule,
        events,
      };
    }

    const cancelledAssignment = ["accepted", "proposed", "pending-review"].includes(assignment.status)
      ? transitionAssignmentStatus(assignment, "cancelled", nowISO)
      : assignment;

    await this.assignmentRepository.save(cancelledAssignment);

    const task = await this.taskRepository.findById(cancelledSchedule.taskId);
    const cancelledTask =
      task && ["open", "matching", "assignable", "assigned", "scheduled"].includes(task.status)
        ? transitionTaskStatus(task, "cancelled", nowISO)
        : task;

    if (cancelledTask) {
      await this.taskRepository.save(cancelledTask);
    }

    events.push({
      type: "ScheduleCancelled",
      requestId: cancelledAssignment.requestId,
      scheduleId: cancelledSchedule.scheduleId,
      assignmentId: cancelledSchedule.assignmentId,
      taskId: cancelledSchedule.taskId,
      reason: input.reason ?? "cancelled",
      occurredAtISO: nowISO,
    });

    await this.projectionRepository.project(events);

    return {
      command: commandSuccess(cancelledSchedule.scheduleId, Date.now()),
      schedule: cancelledSchedule,
      assignment: cancelledAssignment ?? undefined,
      task: cancelledTask ?? undefined,
      events,
    };
  }
}
