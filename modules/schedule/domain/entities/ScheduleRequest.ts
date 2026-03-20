export const SCHEDULE_REQUEST_STATUSES = [
  "draft",
  "submitted",
  "cancelled",
  "closed",
] as const;

export type ScheduleRequestStatus = (typeof SCHEDULE_REQUEST_STATUSES)[number];

export const SCHEDULE_SKILL_PROFICIENCY_LEVELS = ["junior", "mid", "senior"] as const;

export type ScheduleSkillProficiencyLevel =
  (typeof SCHEDULE_SKILL_PROFICIENCY_LEVELS)[number];

export interface SkillRequirement {
  readonly skillId: string;
  readonly minProficiency: ScheduleSkillProficiencyLevel;
  readonly requiredHeadcount: number;
}

export interface ScheduleRequest {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly status: ScheduleRequestStatus;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly proposedStartAtISO: string | null;
  readonly notes: string;
  readonly submittedByAccountId: string;
  readonly submittedAtISO: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface SubmitScheduleRequestInput {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly proposedStartAtISO?: string | null;
  readonly notes?: string | null;
  readonly actorAccountId: string;
}

const SCHEDULE_REQUEST_STATUS_TRANSITIONS: Record<
  ScheduleRequestStatus,
  readonly ScheduleRequestStatus[]
> = {
  draft: ["submitted", "cancelled"],
  submitted: ["cancelled", "closed"],
  cancelled: [],
  closed: [],
} as const;

export function transitionScheduleRequestStatus(
  request: ScheduleRequest,
  nextStatus: ScheduleRequestStatus,
  nowISO: string,
): ScheduleRequest {
  const allowed = SCHEDULE_REQUEST_STATUS_TRANSITIONS[request.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    const guidance =
      nextStatus === "cancelled"
        ? "Schedule requests can only be cancelled while they are in draft or submitted status."
        : `Schedule request must first enter a state that allows transition to ${nextStatus}.`;
    throw new Error(
      `Invalid schedule request transition: ${request.status} -> ${nextStatus}. Allowed: ${allowed.join(", ") || "(none)"}. ${guidance}`,
    );
  }

  return {
    ...request,
    status: nextStatus,
    updatedAtISO: nowISO,
  };
}

export function canCancelScheduleRequestStatus(status: ScheduleRequestStatus): boolean {
  return SCHEDULE_REQUEST_STATUS_TRANSITIONS[status]?.includes("cancelled") ?? false;
}
