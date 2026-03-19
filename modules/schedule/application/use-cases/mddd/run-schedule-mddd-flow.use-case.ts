import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import {
  createAssignment,
  createRequest,
  createSchedule,
  createTask,
  matchTaskCandidates,
  canAllocateSchedule,
  type AccountUser,
  type CalendarSlot,
  type Organization,
  type Request,
  type Schedule,
  type ScheduleDomainEvent,
  type SkillRequirement,
  type Task,
} from "../../../domain/mddd";

// In this first runtime slice, one assignment consumes one abstract capacity unit.
const DEFAULT_ASSIGNMENT_LOAD_WEIGHT = 1;

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

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
  readonly notes?: string;
  readonly actorAccountUserId: string;
  readonly candidates: readonly AccountUser[];
  readonly scheduleSlot: CalendarSlot;
  readonly existingSchedules?: readonly Schedule[];
}

export interface RunScheduleMdddFlowOutput {
  readonly request: Request;
  readonly task: Task;
  readonly assignmentId: string;
  readonly scheduleId: string;
  readonly events: readonly ScheduleDomainEvent[];
}

export class RunScheduleMdddFlowUseCase {
  execute(input: RunScheduleMdddFlowInput): RunScheduleMdddFlowResult {
    const nowISO = new Date().toISOString();

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

    const request = createRequest({
      requestId: createId("req"),
      workspaceId: input.workspaceId,
      organizationId: input.organization.organizationId,
      requiredSkills: input.requiredSkills,
      requestedWindowStartISO: input.requestedWindowStartISO ?? null,
      requestedWindowEndISO: input.requestedWindowEndISO ?? null,
      notes: input.notes,
      createdByAccountUserId: input.actorAccountUserId,
      nowISO,
    });

    const task = createTask({
      taskId: createId("task"),
      requestId: request.requestId,
      organizationId: request.organizationId,
      requiredSkills: request.requiredSkills,
      requiredHeadcount: input.requiredHeadcount,
      targetWindowStartISO: request.requestedWindowStartISO,
      targetWindowEndISO: request.requestedWindowEndISO,
      nowISO,
    });

    const matching = matchTaskCandidates({
      task,
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

    const assignment = createAssignment({
      assignmentId: createId("assignment"),
      requestId: request.requestId,
      taskId: task.taskId,
      organizationId: request.organizationId,
      assigneeAccountUserId: selectedCandidate.accountUserId,
      selectedMatchId: matching.bestMatch.matchId,
      nowISO,
    });

    const schedule = createSchedule({
      scheduleId: createId("schedule"),
      assignmentId: assignment.assignmentId,
      taskId: task.taskId,
      assigneeAccountUserId: selectedCandidate.accountUserId,
      calendarSlot: input.scheduleSlot,
      loadUnits: DEFAULT_ASSIGNMENT_LOAD_WEIGHT,
      nowISO,
    });

    const events: ScheduleDomainEvent[] = [
      {
        type: "RequestCreated",
        requestId: request.requestId,
        workspaceId: request.workspaceId,
        organizationId: request.organizationId,
        occurredAtISO: nowISO,
      },
      {
        type: "TaskMatched",
        taskId: task.taskId,
        requestId: request.requestId,
        topMatchId: matching.bestMatch.matchId,
        occurredAtISO: nowISO,
      },
      {
        type: "AssignmentAccepted",
        assignmentId: assignment.assignmentId,
        taskId: task.taskId,
        assigneeAccountUserId: assignment.assigneeAccountUserId,
        occurredAtISO: nowISO,
      },
    ];

    return {
      success: true,
      command: commandSuccess(schedule.scheduleId, Date.now()),
      data: {
        request,
        task,
        assignmentId: assignment.assignmentId,
        scheduleId: schedule.scheduleId,
        events,
      },
    };
  }
}
