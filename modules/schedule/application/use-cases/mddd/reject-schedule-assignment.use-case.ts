import { commandFailure, commandSuccess, type CommandResult } from "@shared-types";
import {
  transitionAssignmentStatus,
  transitionTaskStatus,
  type Assignment,
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
  ScheduleMdddTaskRepository,
} from "../../../domain/mddd/repositories";

export interface RejectScheduleAssignmentInput {
  readonly assignmentId: string;
  readonly reason: string;
}

export interface RejectScheduleAssignmentResult {
  readonly command: CommandResult;
  readonly assignment?: Assignment;
  readonly task?: Task;
  readonly events: readonly ScheduleDomainEvent[];
}

export class RejectScheduleAssignmentUseCase {
  constructor(
    private readonly assignmentRepository: ScheduleMdddAssignmentRepository,
    private readonly taskRepository: ScheduleMdddTaskRepository,
    private readonly projectionRepository: ScheduleMdddProjectionRepository,
  ) {}

  async execute(
    input: RejectScheduleAssignmentInput,
  ): Promise<RejectScheduleAssignmentResult> {
    const nowISO = new Date().toISOString();
    const events: ScheduleDomainEvent[] = [];

    const assignment = await this.assignmentRepository.findById(input.assignmentId);
    if (!assignment) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.ASSIGNMENT_NOT_FOUND,
            "Assignment not found.",
            { assignmentId: input.assignmentId },
          ),
        ),
        events,
      };
    }

    if (!["pending-review", "proposed"].includes(assignment.status)) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.ASSIGNMENT_REJECT_INVALID,
            `Assignment status ${assignment.status} cannot be rejected.`,
            { assignmentId: assignment.assignmentId, status: assignment.status },
          ),
        ),
        assignment,
        events,
      };
    }

    const reviewReadyAssignment =
      assignment.status === "proposed"
        ? assignment
        : transitionAssignmentStatus(assignment, "proposed", nowISO);
    const rejectedAssignment = transitionAssignmentStatus(
      reviewReadyAssignment,
      "rejected",
      nowISO,
    );
    await this.assignmentRepository.save(rejectedAssignment);

    const task = await this.taskRepository.findById(rejectedAssignment.taskId);
    if (!task) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.TASK_NOT_FOUND,
            "Task not found for assignment.",
            { taskId: rejectedAssignment.taskId },
          ),
        ),
        assignment: rejectedAssignment,
        events,
      };
    }

    const cancelledTask = ["completed", "cancelled"].includes(task.status)
      ? task
      : transitionTaskStatus(task, "cancelled", nowISO);
    await this.taskRepository.save(cancelledTask);

    events.push({
      type: "AssignmentRejected",
      requestId: rejectedAssignment.requestId,
      assignmentId: rejectedAssignment.assignmentId,
      taskId: rejectedAssignment.taskId,
      assigneeAccountUserId: rejectedAssignment.assigneeAccountUserId,
      reason: input.reason,
      occurredAtISO: nowISO,
    });

    await this.projectionRepository.project(events);

    return {
      command: commandSuccess(rejectedAssignment.assignmentId, Date.now()),
      assignment: rejectedAssignment,
      task: cancelledTask,
      events,
    };
  }
}
