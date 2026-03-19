import { commandFailure, commandSuccess, type CommandResult } from "@/shared/types";
import {
  canAllocateSchedule,
  createAssignment,
  createRequest,
  createSchedule,
  createTask,
  hasValidCalendarSlotRange,
  matchTaskCandidates,
  transitionAssignmentStatus,
  transitionRequestStatus,
  transitionScheduleStatus,
  transitionTaskStatus,
  type AccountUser,
  type CalendarSlot,
  type Constraint,
  type Match,
  type Organization,
  type Preference,
  type Request,
  type Schedule,
  type ScheduleDomainEvent,
  type SkillRequirement,
  type Task,
} from "../../../domain/mddd";
import {
  SCHEDULE_MDDD_ERROR_CODES,
  createScheduleMdddDomainError,
} from "../../../domain/mddd/errors";
import type {
  ScheduleMdddAssignmentRepository,
  ScheduleMdddMatchRepository,
  ScheduleMdddProjectionRepository,
  ScheduleMdddRequestRepository,
  ScheduleMdddScheduleRepository,
  ScheduleMdddTaskRepository,
} from "../../../domain/mddd/repositories";
import { createMdddId } from "../../../domain/mddd/utils/create-id";

const DEFAULT_ASSIGNMENT_LOAD_WEIGHT = 1;
const REVIEW_REJECTION_REASON_UNSPECIFIED = "not_approved";
const ASSIGNMENT_REJECTION_REASON_UNSPECIFIED = "not_selected";

export type RunScheduleMdddFlowResult =
  | {
      readonly success: true;
      readonly command: CommandResult;
      readonly data: RunScheduleMdddFlowOutput;
    }
  | {
      readonly success: false;
      readonly command: CommandResult;
      readonly reason: string;
    };

export interface RunScheduleMdddFlowInput {
  readonly workspaceId: string;
  readonly organization: Organization;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly requiredHeadcount: number;
  readonly requestedWindowStartISO?: string | null;
  readonly requestedWindowEndISO?: string | null;
  readonly constraints?: readonly Constraint[];
  readonly preferences?: readonly Preference[];
  readonly notes?: string;
  readonly actorAccountUserId: string;
  readonly candidates: readonly AccountUser[];
  readonly scheduleSlot: CalendarSlot;
  readonly existingSchedules?: readonly Schedule[];
  readonly useScaffoldingFastClose?: boolean;
  readonly reviewOutcome?: "accepted" | "rejected";
  readonly reviewRejectionReason?: string;
  readonly assignmentOutcome?: "accepted" | "rejected";
  readonly assignmentRejectionReason?: string;
}

export interface RunScheduleMdddFlowOutput {
  readonly request: Request;
  readonly task?: Task;
  readonly assignmentId?: string;
  readonly scheduleId?: string;
  readonly events: readonly ScheduleDomainEvent[];
  readonly matches?: readonly Match[];
}

export class RunScheduleMdddFlowUseCase {
  constructor(
    private readonly requestRepository: ScheduleMdddRequestRepository,
    private readonly taskRepository: ScheduleMdddTaskRepository,
    private readonly matchRepository: ScheduleMdddMatchRepository,
    private readonly assignmentRepository: ScheduleMdddAssignmentRepository,
    private readonly scheduleRepository: ScheduleMdddScheduleRepository,
    private readonly projectionRepository: ScheduleMdddProjectionRepository,
  ) {}

  async execute(input: RunScheduleMdddFlowInput): Promise<RunScheduleMdddFlowResult> {
    const nowISO = new Date().toISOString();
    const useScaffoldingFastClose = input.useScaffoldingFastClose ?? true;
    const reviewOutcome = input.reviewOutcome;
    const assignmentOutcome = input.assignmentOutcome ?? "accepted";
    const events: ScheduleDomainEvent[] = [];

    try {
      if (!input.workspaceId.trim()) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.WORKSPACE_REQUIRED,
              "Workspace is required.",
            ),
          ),
          reason: "invalid_workspace",
        };
      }

      if (input.requiredSkills.length === 0 || input.requiredHeadcount <= 0) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.REQUIREMENTS_INVALID,
              "Schedule request requires positive headcount and at least one skill requirement.",
            ),
          ),
          reason: "invalid_requirements",
        };
      }

      if (!hasValidCalendarSlotRange(input.scheduleSlot)) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.SLOT_INVALID,
              "Schedule slot must have valid ISO timestamps with start before end.",
              { scheduleSlot: input.scheduleSlot },
            ),
          ),
          reason: "invalid_schedule_slot",
        };
      }

      if (!useScaffoldingFastClose && !reviewOutcome) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.REVIEW_OUTCOME_REQUIRED,
              "Review outcome is required when scaffolding fast-close mode is disabled.",
            ),
          ),
          reason: "review_outcome_required",
        };
      }

      const createdRequest = createRequest({
        requestId: createMdddId("req"),
        workspaceId: input.workspaceId,
        organizationId: input.organization.organizationId,
        requiredSkills: input.requiredSkills,
        requestedWindowStartISO: input.requestedWindowStartISO ?? null,
        requestedWindowEndISO: input.requestedWindowEndISO ?? null,
        constraints: input.constraints,
        preferences: input.preferences,
        notes: input.notes,
        createdByAccountUserId: input.actorAccountUserId,
        nowISO,
      });

      const underReviewRequest = transitionRequestStatus(createdRequest, "under-review", nowISO);
      const reviewedRequest = transitionRequestStatus(
        underReviewRequest,
        reviewOutcome ?? "accepted",
        nowISO,
      );

      await this.requestRepository.save(reviewedRequest);

      events.push({
        type: "RequestCreated",
        requestId: reviewedRequest.requestId,
        workspaceId: reviewedRequest.workspaceId,
        organizationId: reviewedRequest.organizationId,
        occurredAtISO: nowISO,
      });

      if (reviewOutcome === "rejected") {
        const closedRejectedRequest = transitionRequestStatus(reviewedRequest, "closed", nowISO);
        await this.requestRepository.save(closedRejectedRequest);

        events.push({
          type: "RequestRejected",
          requestId: closedRejectedRequest.requestId,
          workspaceId: closedRejectedRequest.workspaceId,
          organizationId: closedRejectedRequest.organizationId,
          reason: input.reviewRejectionReason ?? REVIEW_REJECTION_REASON_UNSPECIFIED,
          occurredAtISO: nowISO,
        });

        await this.projectionRepository.project(events);

        return {
          success: true,
          command: commandSuccess(closedRejectedRequest.requestId, Date.now()),
          data: {
            request: closedRejectedRequest,
            events,
          },
        };
      }

      events.push({
        type: "RequestAccepted",
        requestId: reviewedRequest.requestId,
        workspaceId: reviewedRequest.workspaceId,
        organizationId: reviewedRequest.organizationId,
        occurredAtISO: nowISO,
      });

      const request = useScaffoldingFastClose
        ? transitionRequestStatus(reviewedRequest, "closed", nowISO)
        : reviewedRequest;
      await this.requestRepository.save(request);

      const createdTask = createTask({
        taskId: createMdddId("task"),
        requestId: request.requestId,
        organizationId: request.organizationId,
        requiredSkills: request.requiredSkills,
        requiredHeadcount: input.requiredHeadcount,
        targetWindowStartISO: request.requestedWindowStartISO,
        targetWindowEndISO: request.requestedWindowEndISO,
        constraints: request.constraints,
        preferences: request.preferences,
        nowISO,
      });

      const matchingTask = transitionTaskStatus(createdTask, "matching", nowISO);
      await this.taskRepository.save(matchingTask);

      const matching = matchTaskCandidates({
        task: matchingTask,
        candidates: input.candidates,
        organization: input.organization,
        nowISO,
      });
      await this.matchRepository.saveAll(matching.matches);

      if (!matching.bestMatch) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.MATCH_NOT_FOUND,
              "No eligible member found for required skills/capabilities and constraints.",
              { taskId: matchingTask.taskId },
            ),
          ),
          reason: "no_eligible_match",
        };
      }

      const selectedCandidate = input.candidates.find(
        (candidate) => candidate.accountUserId === matching.bestMatch?.candidateAccountUserId,
      );

      if (!selectedCandidate) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.MATCH_CANDIDATE_NOT_FOUND,
              "Selected match candidate is missing from candidate pool.",
              { taskId: matchingTask.taskId, matchId: matching.bestMatch.matchId },
            ),
          ),
          reason: "candidate_not_found",
        };
      }

      const allocation = canAllocateSchedule({
        slot: input.scheduleSlot,
        availability: selectedCandidate.availability,
        schedules: input.existingSchedules ?? [],
        assigneeAccountUserId: selectedCandidate.accountUserId,
        existingLoadUnits: selectedCandidate.currentLoadUnits,
        nextLoadUnits: DEFAULT_ASSIGNMENT_LOAD_WEIGHT,
        maxConcurrentAssignments: input.organization.maxConcurrentAssignmentsPerMember,
        maxLoadPerMember: input.organization.maxLoadPerMember,
      });

      if (!allocation.allowed) {
        return {
          success: false,
          command: commandFailure(
            createScheduleMdddDomainError(
              SCHEDULE_MDDD_ERROR_CODES.ALLOCATION_REJECTED,
              `Scheduling rejected: ${allocation.reason ?? "unknown"}`,
              { taskId: matchingTask.taskId, reason: allocation.reason },
            ),
          ),
          reason: allocation.reason ?? "allocation_rejected",
        };
      }

      const proposedAssignment = createAssignment({
        assignmentId: createMdddId("assignment"),
        requestId: request.requestId,
        taskId: matchingTask.taskId,
        organizationId: request.organizationId,
        assigneeAccountUserId: selectedCandidate.accountUserId,
        selectedMatchId: matching.bestMatch.matchId,
        initialStatus: "proposed",
        nowISO,
      });
      await this.assignmentRepository.save(proposedAssignment);

      const assignableTask = transitionTaskStatus(matchingTask, "assignable", nowISO);
      await this.taskRepository.save(assignableTask);

      if (assignmentOutcome === "rejected") {
        const rejectedAssignment = transitionAssignmentStatus(proposedAssignment, "rejected", nowISO);
        await this.assignmentRepository.save(rejectedAssignment);

        events.push(
          {
            type: "TaskMatched",
            requestId: request.requestId,
            taskId: matchingTask.taskId,
            topMatchId: matching.bestMatch.matchId,
            occurredAtISO: nowISO,
          },
          {
            type: "AssignmentRejected",
            requestId: request.requestId,
            assignmentId: rejectedAssignment.assignmentId,
            taskId: matchingTask.taskId,
            assigneeAccountUserId: rejectedAssignment.assigneeAccountUserId,
            reason: input.assignmentRejectionReason ?? ASSIGNMENT_REJECTION_REASON_UNSPECIFIED,
            occurredAtISO: nowISO,
          },
        );

        await this.projectionRepository.project(events);

        return {
          success: true,
          command: commandSuccess(rejectedAssignment.assignmentId, Date.now()),
          data: {
            request,
            task: assignableTask,
            assignmentId: rejectedAssignment.assignmentId,
            events,
            matches: matching.matches,
          },
        };
      }

      const assignment = transitionAssignmentStatus(proposedAssignment, "accepted", nowISO);
      await this.assignmentRepository.save(assignment);

      const assignedTask = transitionTaskStatus(assignableTask, "assigned", nowISO);
      await this.taskRepository.save(assignedTask);

      const plannedSchedule = createSchedule({
        scheduleId: createMdddId("schedule"),
        assignmentId: assignment.assignmentId,
        taskId: assignedTask.taskId,
        assigneeAccountUserId: selectedCandidate.accountUserId,
        calendarSlot: input.scheduleSlot,
        loadUnits: DEFAULT_ASSIGNMENT_LOAD_WEIGHT,
        nowISO,
      });

      const scheduleReserved = transitionScheduleStatus(plannedSchedule, "reserved", nowISO);
      const nowAt = Date.parse(nowISO);
      const slotStartAt = Date.parse(input.scheduleSlot.startAtISO);
      const slotEndAt = Date.parse(input.scheduleSlot.endAtISO);

      const shouldActivateNow = nowAt >= slotStartAt;
      const scheduleActive = shouldActivateNow
        ? transitionScheduleStatus(scheduleReserved, "active", nowISO)
        : scheduleReserved;
      const shouldCompleteNow = shouldActivateNow && nowAt >= slotEndAt;
      const finalSchedule = shouldCompleteNow
        ? transitionScheduleStatus(scheduleActive, "completed", nowISO)
        : scheduleActive;
      await this.scheduleRepository.save(finalSchedule);

      const scheduledTask = shouldActivateNow
        ? transitionTaskStatus(assignedTask, "scheduled", nowISO)
        : assignedTask;
      const finalTask = shouldCompleteNow
        ? transitionTaskStatus(scheduledTask, "completed", nowISO)
        : scheduledTask;
      await this.taskRepository.save(finalTask);

      events.push(
        {
          type: "TaskMatched",
          requestId: request.requestId,
          taskId: finalTask.taskId,
          topMatchId: matching.bestMatch.matchId,
          occurredAtISO: nowISO,
        },
        {
          type: "AssignmentAccepted",
          requestId: request.requestId,
          assignmentId: assignment.assignmentId,
          taskId: finalTask.taskId,
          assigneeAccountUserId: assignment.assigneeAccountUserId,
          occurredAtISO: nowISO,
        },
        {
          type: "ScheduleReserved",
          requestId: request.requestId,
          scheduleId: finalSchedule.scheduleId,
          assignmentId: assignment.assignmentId,
          taskId: finalTask.taskId,
          occurredAtISO: nowISO,
        },
      );

      if (shouldCompleteNow) {
        events.push({
          type: "TaskCompleted",
          requestId: request.requestId,
          taskId: finalTask.taskId,
          scheduleId: finalSchedule.scheduleId,
          occurredAtISO: nowISO,
        });
      }

      await this.projectionRepository.project(events);

      return {
        success: true,
        command: commandSuccess(finalSchedule.scheduleId, Date.now()),
        data: {
          request,
          task: finalTask,
          assignmentId: assignment.assignmentId,
          scheduleId: finalSchedule.scheduleId,
          events,
          matches: matching.matches,
        },
      };
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
}
