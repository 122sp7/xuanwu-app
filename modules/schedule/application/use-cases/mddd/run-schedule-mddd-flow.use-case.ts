import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import {
  createAssignment,
  createRequest,
  createSchedule,
  createTask,
  matchTaskCandidates,
  canAllocateSchedule,
  hasValidCalendarSlotRange,
  transitionAssignmentStatus,
  transitionRequestStatus,
  transitionScheduleStatus,
  transitionTaskStatus,
  type AccountUser,
  type CalendarSlot,
  type Constraint,
  type Organization,
  type Preference,
  type Request,
  type Schedule,
  type ScheduleDomainEvent,
  type SkillRequirement,
  type Task,
} from "../../../domain/mddd";
import { createMdddId } from "../../../domain/mddd/utils/create-id";

// In this first runtime slice, one assignment consumes one abstract capacity unit.
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
}

export class RunScheduleMdddFlowUseCase {
  execute(input: RunScheduleMdddFlowInput): RunScheduleMdddFlowResult {
    const nowISO = new Date().toISOString();
    const useScaffoldingFastClose = input.useScaffoldingFastClose ?? true;
    const reviewOutcome = input.reviewOutcome;
    const assignmentOutcome = input.assignmentOutcome ?? "accepted";
    const events: ScheduleDomainEvent[] = [];

    if (!input.workspaceId.trim()) {
      return {
        success: false,
        command: commandFailureFrom("SCHEDULE_WORKSPACE_REQUIRED", "Workspace is required."),
        reason: "invalid_workspace",
      };
    }

    if (input.requiredSkills.length === 0 || input.requiredHeadcount <= 0) {
      return {
        success: false,
        command: commandFailureFrom(
          "SCHEDULE_REQUIREMENTS_INVALID",
          "Schedule request requires positive headcount and at least one skill requirement.",
        ),
        reason: "invalid_requirements",
      };
    }

    if (!hasValidCalendarSlotRange(input.scheduleSlot)) {
      return {
        success: false,
        command: commandFailureFrom(
          "SCHEDULE_SLOT_INVALID",
          "Schedule slot must have valid ISO timestamps with start before end.",
        ),
        reason: "invalid_schedule_slot",
      };
    }

    if (!useScaffoldingFastClose && !reviewOutcome) {
      return {
        success: false,
        command: commandFailureFrom(
          "SCHEDULE_REVIEW_OUTCOME_REQUIRED",
          "Review outcome is required when scaffolding fast-close mode is disabled.",
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

    // TODO(schedule-mddd): remove fast-close scaffolding when full review/approval flow is implemented.
    // First executable slice can run with temporary fast-close behavior for accepted requests
    // to keep end-to-end orchestration validation simple.
    const underReviewRequest = transitionRequestStatus(createdRequest, "under-review", nowISO);
    // In scaffolding mode, an omitted review outcome follows the accepted path to
    // preserve the original end-to-end orchestration behavior.
    const reviewedRequest = transitionRequestStatus(
      underReviewRequest,
      reviewOutcome ?? "accepted",
      nowISO,
    );

    events.push({
      type: "RequestCreated",
      requestId: reviewedRequest.requestId,
      workspaceId: reviewedRequest.workspaceId,
      organizationId: reviewedRequest.organizationId,
      occurredAtISO: nowISO,
    });

    if (reviewOutcome === "rejected") {
      const closedRejectedRequest = transitionRequestStatus(reviewedRequest, "closed", nowISO);
      events.push({
        type: "RequestRejected",
        requestId: closedRejectedRequest.requestId,
        workspaceId: closedRejectedRequest.workspaceId,
        organizationId: closedRejectedRequest.organizationId,
        reason: input.reviewRejectionReason ?? REVIEW_REJECTION_REASON_UNSPECIFIED,
        occurredAtISO: nowISO,
      });

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

    const matching = matchTaskCandidates({
      task: matchingTask,
      candidates: input.candidates,
      organization: input.organization,
      nowISO,
    });

    if (!matching.bestMatch) {
      return {
        success: false,
        command: commandFailureFrom(
          "SCHEDULE_MATCH_NOT_FOUND",
          "No eligible member found for required skills/capabilities and constraints.",
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
        command: commandFailureFrom(
          "SCHEDULE_MATCH_CANDIDATE_NOT_FOUND",
          "Selected match candidate is missing from candidate pool.",
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
    });

    if (!allocation.allowed) {
      return {
        success: false,
        command: commandFailureFrom(
          "SCHEDULE_ALLOCATION_REJECTED",
          `Scheduling rejected: ${allocation.reason ?? "unknown"}`,
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

    const assignableTask = transitionTaskStatus(matchingTask, "assignable", nowISO);

    if (assignmentOutcome === "rejected") {
      const rejectedAssignment = transitionAssignmentStatus(proposedAssignment, "rejected", nowISO);
      events.push({
        type: "AssignmentRejected",
        assignmentId: rejectedAssignment.assignmentId,
        taskId: matchingTask.taskId,
        assigneeAccountUserId: rejectedAssignment.assigneeAccountUserId,
        reason: input.assignmentRejectionReason ?? ASSIGNMENT_REJECTION_REASON_UNSPECIFIED,
        occurredAtISO: nowISO,
      });

      return {
        success: true,
        command: commandSuccess(rejectedAssignment.assignmentId, Date.now()),
        data: {
          request,
          task: assignableTask,
          assignmentId: rejectedAssignment.assignmentId,
          events,
        },
      };
    }

    const assignment = transitionAssignmentStatus(proposedAssignment, "accepted", nowISO);
    const assignedTask = transitionTaskStatus(assignableTask, "assigned", nowISO);

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
    const { startAtISO, endAtISO } = input.scheduleSlot;
    const slotStartAt = Date.parse(startAtISO);
    const slotEndAt = Date.parse(endAtISO);

    const shouldActivateNow = nowAt >= slotStartAt;
    const scheduleActive = shouldActivateNow
      ? transitionScheduleStatus(scheduleReserved, "active", nowISO)
      : scheduleReserved;
    const shouldCompleteNow = shouldActivateNow && nowAt >= slotEndAt;
    const finalSchedule = shouldCompleteNow
      ? transitionScheduleStatus(scheduleActive, "completed", nowISO)
      : scheduleActive;

    const scheduledTask = shouldActivateNow
      ? transitionTaskStatus(assignedTask, "scheduled", nowISO)
      : assignedTask;
    const finalTask = shouldCompleteNow
      ? transitionTaskStatus(scheduledTask, "completed", nowISO)
      : scheduledTask;

    events.push(
      {
        type: "TaskMatched",
        taskId: finalTask.taskId,
        requestId: request.requestId,
        topMatchId: matching.bestMatch.matchId,
        occurredAtISO: nowISO,
      },
      {
        type: "AssignmentAccepted",
        assignmentId: assignment.assignmentId,
        taskId: finalTask.taskId,
        assigneeAccountUserId: assignment.assigneeAccountUserId,
        occurredAtISO: nowISO,
      },
      {
        type: "ScheduleReserved",
        scheduleId: finalSchedule.scheduleId,
        assignmentId: assignment.assignmentId,
        taskId: finalTask.taskId,
        occurredAtISO: nowISO,
      },
    );

    if (shouldCompleteNow) {
      events.push({
        type: "TaskCompleted",
        taskId: finalTask.taskId,
        scheduleId: finalSchedule.scheduleId,
        occurredAtISO: nowISO,
      });
    }

    return {
      success: true,
      command: commandSuccess(finalSchedule.scheduleId, Date.now()),
      data: {
        request,
        task: finalTask,
        assignmentId: assignment.assignmentId,
        scheduleId: finalSchedule.scheduleId,
        events,
      },
    };
  }
}
