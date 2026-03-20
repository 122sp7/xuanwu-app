import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import { transitionScheduleRequestStatus } from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequest } from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequestRepository } from "../../domain/repositories/ScheduleRequestRepository";

export interface CancelScheduleRequestInput {
  readonly requestId: string;
  readonly actorAccountId: string;
}

export interface CancelScheduleRequestResult {
  readonly command: CommandResult;
  readonly request?: ScheduleRequest;
}

export class CancelScheduleRequestUseCase {
  constructor(private readonly scheduleRequestRepository: ScheduleRequestRepository) {}

  async execute(input: CancelScheduleRequestInput): Promise<CancelScheduleRequestResult> {
    const requestId = input.requestId.trim();
    const actorAccountId = input.actorAccountId.trim();

    if (!requestId) {
      return {
        command: commandFailureFrom(
          "SCHEDULE_REQUEST_ID_REQUIRED",
          "Schedule request id is required.",
        ),
      };
    }

    if (!actorAccountId) {
      return {
        command: commandFailureFrom(
          "SCHEDULE_ACTOR_REQUIRED",
          "Actor account is required.",
        ),
      };
    }

    try {
      const existingRequest = await this.scheduleRequestRepository.findById(requestId);
      if (!existingRequest) {
        return {
          command: commandFailureFrom(
            "SCHEDULE_REQUEST_NOT_FOUND",
            "Schedule request was not found.",
            { requestId },
          ),
        };
      }

      if (existingRequest.submittedByAccountId !== actorAccountId) {
        return {
          command: commandFailureFrom(
            "SCHEDULE_REQUEST_CANCEL_FORBIDDEN",
            "Only the request creator can cancel this schedule request.",
            { requestId, actorAccountId },
          ),
          request: existingRequest,
        };
      }

      if (!["draft", "submitted"].includes(existingRequest.status)) {
        return {
          command: commandFailureFrom(
            "SCHEDULE_REQUEST_CANCEL_INVALID",
            `Schedule request status ${existingRequest.status} cannot be cancelled.`,
            { requestId, status: existingRequest.status },
          ),
          request: existingRequest,
        };
      }

      const cancelledRequest = transitionScheduleRequestStatus(
        existingRequest,
        "cancelled",
        new Date().toISOString(),
      );
      await this.scheduleRequestRepository.save(cancelledRequest);

      return {
        command: commandSuccess(cancelledRequest.id, Date.now()),
        request: cancelledRequest,
      };
    } catch (error) {
      return {
        command: commandFailureFrom(
          "SCHEDULE_REQUEST_CANCEL_FAILED",
          error instanceof Error ? error.message : "Unexpected schedule request cancellation error",
          { requestId },
        ),
      };
    }
  }
}
