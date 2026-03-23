/**
 * Module: issue
 * Layer: domain/event
 * Purpose: Domain events emitted by the Issue aggregate (cross-domain supporting domain).
 *
 * These events are designed for consumption by any domain that creates issues.
 * Consumers (QA, Acceptance, Finance) listen for IssueResolvedEvent to resume
 * their own flows after a regression is fixed.
 *
 * Event flow:
 *   IssueCreated → IssueStatusChanged(×n) → IssueResolved → IssueClosed
 *
 * Cross-domain notification pattern:
 *   QA raises issue  → issue domain manages it → IssueResolved (stage=qa) →
 *   QA domain resumes test run
 */

import type { IssueLifecycleStatus, IssueStage } from "../value-objects/issue-state";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface IssueCreatedEvent {
  readonly type: "issue.created";
  readonly issueId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** Which domain context produced this issue. */
  readonly stage: IssueStage;
  /** The aggregate ID in the originating domain (taskId, testRunId, acceptanceId, invoiceId). */
  readonly relatedId: string;
  readonly title: string;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}

export interface IssueStatusChangedEvent {
  readonly type: "issue.status_changed";
  readonly issueId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly stage: IssueStage;
  readonly relatedId: string;
  readonly from: IssueLifecycleStatus;
  readonly to: IssueLifecycleStatus;
  readonly occurredAtISO: string;
}

export interface IssueAssignedEvent {
  readonly type: "issue.assigned";
  readonly issueId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly assignedTo: string;
  readonly occurredAtISO: string;
}

/** Emitted when issue transitions to "resolved" — origin domain can resume. */
export interface IssueResolvedEvent {
  readonly type: "issue.resolved";
  readonly issueId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** Originating domain stage — used by consumers to know which flow to resume. */
  readonly stage: IssueStage;
  readonly relatedId: string;
  readonly resolvedAtISO: string;
  readonly occurredAtISO: string;
}

export interface IssueClosedEvent {
  readonly type: "issue.closed";
  readonly issueId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type IssueDomainEvent =
  | IssueCreatedEvent
  | IssueStatusChangedEvent
  | IssueAssignedEvent
  | IssueResolvedEvent
  | IssueClosedEvent;
