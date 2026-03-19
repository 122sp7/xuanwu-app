import type {
  AssignmentStatus,
  RequestStatus,
  ScheduleStatus,
  TaskStatus,
} from "./WorkflowStatuses";

export interface ScheduleMdddFlowProjection {
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly requestStatus: RequestStatus;
  readonly taskId: string | null;
  readonly taskStatus: TaskStatus | null;
  readonly assignmentId: string | null;
  readonly assignmentStatus: AssignmentStatus | null;
  readonly scheduleId: string | null;
  readonly scheduleStatus: ScheduleStatus | null;
  readonly assigneeAccountUserId: string | null;
  readonly lastReason: string | null;
  readonly eventTypes: readonly string[];
  readonly updatedAtISO: string;
}
