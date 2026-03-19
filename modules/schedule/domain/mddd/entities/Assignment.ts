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
  readonly nowISO: string;
}

export function createAssignment(input: CreateAssignmentInput): Assignment {
  return {
    assignmentId: input.assignmentId,
    requestId: input.requestId,
    taskId: input.taskId,
    organizationId: input.organizationId,
    teamId: input.teamId ?? null,
    assigneeAccountUserId: input.assigneeAccountUserId,
    selectedMatchId: input.selectedMatchId,
    status: "accepted",
    acceptedAtISO: input.nowISO,
    createdAtISO: input.nowISO,
    updatedAtISO: input.nowISO,
  };
}
