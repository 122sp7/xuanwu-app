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

const REQUEST_STATUS_TRANSITIONS: Record<RequestStatus, readonly RequestStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["under-review", "cancelled"],
  "under-review": ["closed", "cancelled"],
  cancelled: [],
  closed: [],
} as const;

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

export function transitionRequestStatus(
  request: Request,
  nextStatus: RequestStatus,
  nowISO: string,
): Request {
  const allowed = REQUEST_STATUS_TRANSITIONS[request.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `Invalid request transition: ${request.status} -> ${nextStatus}. Allowed: ${allowed.join(", ") || "(none)"}`,
    );
  }

  return {
    ...request,
    status: nextStatus,
    updatedAtISO: nowISO,
  };
}
