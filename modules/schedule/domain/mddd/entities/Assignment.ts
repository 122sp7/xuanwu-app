import type { AssignmentStatus } from "../value-objects/WorkflowStatuses";

export interface Assignment {
  readonly assignmentId: string;
  readonly requestId: string;
  readonly taskId: string;
  readonly organizationId: string;
  readonly teamId: string | null;
  readonly assigneeAccountUserId: string;
  readonly selectedMatchId: string;
  readonly status: AssignmentStatus;
  readonly acceptedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateAssignmentInput {
  readonly assignmentId: string;
  readonly requestId: string;
  readonly taskId: string;
  readonly organizationId: string;
  readonly teamId?: string | null;
  readonly assigneeAccountUserId: string;
  readonly selectedMatchId: string;
  readonly initialStatus?: AssignmentStatus;
  readonly nowISO: string;
}

const ASSIGNMENT_STATUS_TRANSITIONS: Record<AssignmentStatus, readonly AssignmentStatus[]> = {
  "pending-review": ["proposed", "rejected", "cancelled"],
  proposed: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
  rejected: [],
  cancelled: [],
  completed: [],
} as const;

function resolveAcceptedAtISO(
  status: AssignmentStatus,
  nowISO: string,
  currentAcceptedAtISO: string | null = null,
): string | null {
  if (status === "accepted") {
    return currentAcceptedAtISO ?? nowISO;
  }

  return currentAcceptedAtISO;
}

export function createAssignment(input: CreateAssignmentInput): Assignment {
  const initialStatus = input.initialStatus ?? "pending-review";

  return {
    assignmentId: input.assignmentId,
    requestId: input.requestId,
    taskId: input.taskId,
    organizationId: input.organizationId,
    teamId: input.teamId ?? null,
    assigneeAccountUserId: input.assigneeAccountUserId,
    selectedMatchId: input.selectedMatchId,
    status: initialStatus,
    acceptedAtISO: resolveAcceptedAtISO(initialStatus, input.nowISO),
    createdAtISO: input.nowISO,
    updatedAtISO: input.nowISO,
  };
}

export function transitionAssignmentStatus(
  assignment: Assignment,
  nextStatus: AssignmentStatus,
  nowISO: string,
): Assignment {
  const allowed = ASSIGNMENT_STATUS_TRANSITIONS[assignment.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `Invalid assignment transition: ${assignment.status} -> ${nextStatus}. Allowed: ${allowed.join(", ") || "(none)"}`,
    );
  }

  return {
    ...assignment,
    status: nextStatus,
    acceptedAtISO: resolveAcceptedAtISO(nextStatus, nowISO, assignment.acceptedAtISO),
    updatedAtISO: nowISO,
  };
}
