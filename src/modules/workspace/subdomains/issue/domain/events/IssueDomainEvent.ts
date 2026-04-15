import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueStatus } from "../value-objects/IssueStatus";

export interface IssueDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface IssueOpenedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.opened";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly stage: IssueStage;
    readonly createdBy: string;
  };
}

export interface IssueStatusChangedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.status-changed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly to: IssueStatus;
  };
}

export interface IssueClosedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.closed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
  };
}

export type IssueDomainEventType =
  | IssueOpenedEvent
  | IssueStatusChangedEvent
  | IssueClosedEvent;
