export interface RequestCreatedEvent {
  readonly type: "RequestCreated";
  readonly requestId: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly occurredAtISO: string;
}

export interface TaskMatchedEvent {
  readonly type: "TaskMatched";
  readonly requestId: string;
  readonly taskId: string;
  readonly topMatchId: string;
  readonly occurredAtISO: string;
}

export interface AssignmentAcceptedEvent {
  readonly type: "AssignmentAccepted";
  readonly requestId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly assigneeAccountUserId: string;
  readonly occurredAtISO: string;
}

export interface AssignmentRejectedEvent {
  readonly type: "AssignmentRejected";
  readonly requestId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly assigneeAccountUserId: string;
  readonly reason: string;
  readonly occurredAtISO: string;
}

export interface TaskCompletedEvent {
  readonly type: "TaskCompleted";
  readonly requestId: string;
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
  readonly requestId: string;
  readonly scheduleId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface ScheduleCancelledEvent {
  readonly type: "ScheduleCancelled";
  readonly requestId: string;
  readonly scheduleId: string;
  readonly assignmentId: string;
  readonly taskId: string;
  readonly reason: string;
  readonly occurredAtISO: string;
}

export type ScheduleDomainEvent =
  | RequestCreatedEvent
  | RequestAcceptedEvent
  | RequestRejectedEvent
  | TaskMatchedEvent
  | AssignmentAcceptedEvent
  | AssignmentRejectedEvent
  | ScheduleReservedEvent
  | ScheduleCancelledEvent
  | TaskCompletedEvent;
