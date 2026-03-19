import { commandFailure, commandSuccess, type CommandResult } from "@/shared/types";
import {
  transitionRequestStatus,
  transitionTaskStatus,
  type Request,
  type ScheduleDomainEvent,
  type Task,
} from "../../../domain/mddd";
import {
  SCHEDULE_MDDD_ERROR_CODES,
  createScheduleMdddDomainError,
} from "../../../domain/mddd/errors";
import type {
  ScheduleMdddProjectionRepository,
  ScheduleMdddRequestRepository,
  ScheduleMdddTaskRepository,
} from "../../../domain/mddd/repositories";

export interface RejectScheduleRequestInput {
  readonly requestId: string;
  readonly reason: string;
}

export interface RejectScheduleRequestResult {
  readonly command: CommandResult;
  readonly request?: Request;
  readonly tasks?: readonly Task[];
  readonly events: readonly ScheduleDomainEvent[];
}

export class RejectScheduleRequestUseCase {
  constructor(
    private readonly requestRepository: ScheduleMdddRequestRepository,
    private readonly taskRepository: ScheduleMdddTaskRepository,
    private readonly projectionRepository: ScheduleMdddProjectionRepository,
  ) {}

  async execute(input: RejectScheduleRequestInput): Promise<RejectScheduleRequestResult> {
    const nowISO = new Date().toISOString();
    const events: ScheduleDomainEvent[] = [];

    const request = await this.requestRepository.findById(input.requestId);
    if (!request) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.REQUEST_NOT_FOUND,
            "Request not found.",
            { requestId: input.requestId },
          ),
        ),
        events,
      };
    }

    if (!["submitted", "under-review", "accepted"].includes(request.status)) {
      return {
        command: commandFailure(
          createScheduleMdddDomainError(
            SCHEDULE_MDDD_ERROR_CODES.REQUEST_REJECT_INVALID,
            `Request status ${request.status} cannot be rejected.`,
            { requestId: request.requestId, status: request.status },
          ),
        ),
        request,
        events,
      };
    }

    const reviewReadyRequest =
      request.status === "under-review"
        ? request
        : transitionRequestStatus(request, "under-review", nowISO);
    const rejectedRequest = transitionRequestStatus(reviewReadyRequest, "rejected", nowISO);
    const closedRequest = transitionRequestStatus(rejectedRequest, "closed", nowISO);

    const relatedTasks = await this.taskRepository.listByRequestId(request.requestId);
    const cancelledTasks = await Promise.all(
      relatedTasks.map(async (task) => {
        if (["completed", "cancelled"].includes(task.status)) {
          return task;
        }

        const cancelled = transitionTaskStatus(task, "cancelled", nowISO);
        await this.taskRepository.save(cancelled);
        return cancelled;
      }),
    );

    await this.requestRepository.save(closedRequest);

    events.push({
      type: "RequestRejected",
      requestId: closedRequest.requestId,
      workspaceId: closedRequest.workspaceId,
      organizationId: closedRequest.organizationId,
      reason: input.reason,
      occurredAtISO: nowISO,
    });

    await this.projectionRepository.project(events);

    return {
      command: commandSuccess(closedRequest.requestId, Date.now()),
      request: closedRequest,
      tasks: cancelledTasks,
      events,
    };
  }
}
