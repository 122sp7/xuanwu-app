"use server";

import { commandFailure, type CommandResult } from "@/shared/types";
import {
  CancelScheduleUseCase,
  RejectScheduleAssignmentUseCase,
  RejectScheduleRequestUseCase,
  RunScheduleMdddFlowUseCase,
  type RunScheduleMdddFlowInput,
  type RunScheduleMdddFlowResult,
} from "../../application";
import {
  SCHEDULE_MDDD_ERROR_CODES,
  createScheduleMdddDomainError,
} from "../../domain/mddd/errors";
import {
  FirebaseMdddAssignmentRepository,
  FirebaseMdddMatchRepository,
  FirebaseMdddProjectionRepository,
  FirebaseMdddRequestRepository,
  FirebaseMdddScheduleRepository,
  FirebaseMdddTaskRepository,
} from "../../infrastructure";

function createRepositories() {
  return {
    requestRepository: new FirebaseMdddRequestRepository(),
    taskRepository: new FirebaseMdddTaskRepository(),
    matchRepository: new FirebaseMdddMatchRepository(),
    assignmentRepository: new FirebaseMdddAssignmentRepository(),
    scheduleRepository: new FirebaseMdddScheduleRepository(),
    projectionRepository: new FirebaseMdddProjectionRepository(),
  };
}

function createRunFlowUseCase() {
  const repositories = createRepositories();

  return new RunScheduleMdddFlowUseCase(
    repositories.requestRepository,
    repositories.taskRepository,
    repositories.matchRepository,
    repositories.assignmentRepository,
    repositories.scheduleRepository,
    repositories.projectionRepository,
  );
}

export async function runScheduleMdddFlow(
  input: RunScheduleMdddFlowInput,
): Promise<RunScheduleMdddFlowResult> {
  try {
    return await createRunFlowUseCase().execute(input);
  } catch (error) {
    return {
      success: false,
      command: commandFailure(
        createScheduleMdddDomainError(
          SCHEDULE_MDDD_ERROR_CODES.UNEXPECTED_FLOW_ERROR,
          error instanceof Error ? error.message : "Unexpected schedule MDDD flow error",
        ),
      ),
      reason: "unexpected_error",
    };
  }
}

export async function rejectScheduleRequest(input: {
  readonly requestId: string;
  readonly reason: string;
}): Promise<CommandResult> {
  try {
    const repositories = createRepositories();
    const useCase = new RejectScheduleRequestUseCase(
      repositories.requestRepository,
      repositories.taskRepository,
      repositories.projectionRepository,
    );

    const result = await useCase.execute(input);
    return result.command;
  } catch (error) {
    return commandFailure(
      createScheduleMdddDomainError(
        SCHEDULE_MDDD_ERROR_CODES.REQUEST_REJECT_FAILED,
        error instanceof Error ? error.message : "Unexpected request rejection error",
      ),
    );
  }
}

export async function rejectScheduleAssignment(input: {
  readonly assignmentId: string;
  readonly reason: string;
}): Promise<CommandResult> {
  try {
    const repositories = createRepositories();
    const useCase = new RejectScheduleAssignmentUseCase(
      repositories.assignmentRepository,
      repositories.taskRepository,
      repositories.projectionRepository,
    );

    const result = await useCase.execute(input);
    return result.command;
  } catch (error) {
    return commandFailure(
      createScheduleMdddDomainError(
        SCHEDULE_MDDD_ERROR_CODES.ASSIGNMENT_REJECT_FAILED,
        error instanceof Error ? error.message : "Unexpected assignment rejection error",
      ),
    );
  }
}

export async function cancelSchedule(input: {
  readonly scheduleId: string;
  readonly reason?: string;
}): Promise<CommandResult> {
  try {
    const repositories = createRepositories();
    const useCase = new CancelScheduleUseCase(
      repositories.scheduleRepository,
      repositories.assignmentRepository,
      repositories.taskRepository,
      repositories.projectionRepository,
    );

    const result = await useCase.execute(input);
    return result.command;
  } catch (error) {
    return commandFailure(
      createScheduleMdddDomainError(
        SCHEDULE_MDDD_ERROR_CODES.SCHEDULE_CANCEL_FAILED,
        error instanceof Error ? error.message : "Unexpected schedule cancellation error",
      ),
    );
  }
}
