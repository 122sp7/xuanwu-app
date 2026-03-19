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
