import type { CapabilityRequirement, SkillRequirement } from "../value-objects/Requirements";
import type { Constraint, Preference } from "../value-objects/Scheduling";
import type { TaskStatus } from "../value-objects/WorkflowStatuses";

export interface Task {
  readonly taskId: string;
  readonly requestId: string;
  readonly organizationId: string;
  readonly teamId: string | null;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly requiredCapabilities: readonly CapabilityRequirement[];
  readonly constraints: readonly Constraint[];
  readonly preferences: readonly Preference[];
  readonly requiredHeadcount: number;
  readonly targetWindowStartISO: string | null;
  readonly targetWindowEndISO: string | null;
  readonly status: TaskStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaskInput {
  readonly taskId: string;
  readonly requestId: string;
  readonly organizationId: string;
  readonly teamId?: string | null;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly requiredCapabilities?: readonly CapabilityRequirement[];
  readonly constraints?: readonly Constraint[];
  readonly preferences?: readonly Preference[];
  readonly requiredHeadcount: number;
  readonly targetWindowStartISO?: string | null;
  readonly targetWindowEndISO?: string | null;
  readonly nowISO: string;
}

export function createTask(input: CreateTaskInput): Task {
  return {
    taskId: input.taskId,
    requestId: input.requestId,
    organizationId: input.organizationId,
    teamId: input.teamId ?? null,
    requiredSkills: input.requiredSkills,
    requiredCapabilities: input.requiredCapabilities ?? [],
    constraints: input.constraints ?? [],
    preferences: input.preferences ?? [],
    requiredHeadcount: input.requiredHeadcount,
    targetWindowStartISO: input.targetWindowStartISO ?? null,
    targetWindowEndISO: input.targetWindowEndISO ?? null,
    status: "open",
    createdAtISO: input.nowISO,
    updatedAtISO: input.nowISO,
  };
}
