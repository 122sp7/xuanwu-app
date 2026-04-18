export interface ApprovalDecisionCreatedEvent {
  readonly type: "workspace.approval.decision-created";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
    readonly approverId: string;
  };
}

export interface ApprovalDecisionApprovedEvent {
  readonly type: "workspace.approval.decision-approved";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}

export interface ApprovalDecisionRejectedEvent {
  readonly type: "workspace.approval.decision-rejected";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}

export type ApprovalDomainEventType =
  | ApprovalDecisionCreatedEvent
  | ApprovalDecisionApprovedEvent
  | ApprovalDecisionRejectedEvent;
