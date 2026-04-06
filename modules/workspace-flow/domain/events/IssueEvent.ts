/**
 * @module workspace-flow/domain/events
 * @file IssueEvent.ts
 * @description Discriminated-union event types emitted by the Issue aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface IssueOpenedEvent {
  readonly type: "workspace-flow.issue.opened";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}

export interface IssueStartedEvent {
  readonly type: "workspace-flow.issue.started";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueFixedEvent {
  readonly type: "workspace-flow.issue.fixed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestSubmittedEvent {
  readonly type: "workspace-flow.issue.retest_submitted";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestPassedEvent {
  readonly type: "workspace-flow.issue.retest_passed";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly occurredAtISO: string;
}

export interface IssueRetestFailedEvent {
  readonly type: "workspace-flow.issue.retest_failed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueClosedEvent {
  readonly type: "workspace-flow.issue.closed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueStatusChangedEvent {
  readonly type: "workspace-flow.issue.status_changed";
  readonly issueId: string;
  readonly taskId: string;
  readonly from: IssueStatus;
  readonly to: IssueStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type IssueEvent =
  | IssueOpenedEvent
  | IssueStartedEvent
  | IssueFixedEvent
  | IssueRetestSubmittedEvent
  | IssueRetestPassedEvent
  | IssueRetestFailedEvent
  | IssueClosedEvent
  | IssueStatusChangedEvent;
