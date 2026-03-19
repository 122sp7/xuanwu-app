import type { CapabilityRequirement, SkillRequirement } from "../value-objects/Requirements";
import type { Constraint, Preference } from "../value-objects/Scheduling";
import type { RequestStatus } from "../value-objects/WorkflowStatuses";

export interface Request {
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly status: RequestStatus;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly requiredCapabilities: readonly CapabilityRequirement[];
  readonly constraints: readonly Constraint[];
  readonly preferences: readonly Preference[];
  readonly requestedWindowStartISO: string | null;
  readonly requestedWindowEndISO: string | null;
  readonly notes: string;
  readonly createdByAccountUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateRequestInput {
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly requiredSkills: readonly SkillRequirement[];
  readonly requiredCapabilities?: readonly CapabilityRequirement[];
  readonly constraints?: readonly Constraint[];
  readonly preferences?: readonly Preference[];
  readonly requestedWindowStartISO?: string | null;
  readonly requestedWindowEndISO?: string | null;
  readonly notes?: string;
  readonly createdByAccountUserId: string;
  readonly nowISO: string;
}

export function createRequest(input: CreateRequestInput): Request {
  return {
    requestId: input.requestId,
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    status: "submitted",
    requiredSkills: input.requiredSkills,
    requiredCapabilities: input.requiredCapabilities ?? [],
    constraints: input.constraints ?? [],
    preferences: input.preferences ?? [],
    requestedWindowStartISO: input.requestedWindowStartISO ?? null,
    requestedWindowEndISO: input.requestedWindowEndISO ?? null,
    notes: input.notes ?? "",
    createdByAccountUserId: input.createdByAccountUserId,
    createdAtISO: input.nowISO,
    updatedAtISO: input.nowISO,
  };
}
