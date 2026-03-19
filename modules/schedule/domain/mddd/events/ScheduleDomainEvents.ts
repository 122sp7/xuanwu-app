export interface RequestCreatedEvent {
  readonly type: "RequestCreated";
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly occurredAtISO: string;
}

export interface TaskMatchedEvent {
  readonly type: "TaskMatched";
  readonly taskId: string;
  readonly requestId: string;
  readonly topMatchId: string;
  readonly occurredAtISO: string;
}

export interface AssignmentAcceptedEvent {
  readonly type: "AssignmentAccepted";
  readonly assignmentId: string;
  readonly taskId: string;
  readonly assigneeAccountUserId: string;
  readonly occurredAtISO: string;
}

export interface TaskCompletedEvent {
  readonly type: "TaskCompleted";
  readonly taskId: string;
  readonly scheduleId: string;
  readonly occurredAtISO: string;
}

export interface RequestAcceptedEvent {
  readonly type: "RequestAccepted";
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly occurredAtISO: string;
}

export interface RequestRejectedEvent {
  readonly type: "RequestRejected";
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly reason: string;
  readonly occurredAtISO: string;
}

export interface ScheduleReservedEvent {
  readonly type: "ScheduleReserved";
  readonly scheduleId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export type ScheduleDomainEvent =
  | RequestCreatedEvent
  | RequestAcceptedEvent
  | RequestRejectedEvent
  | TaskMatchedEvent
  | AssignmentAcceptedEvent
  | ScheduleReservedEvent
  | TaskCompletedEvent;
