/**
 * Module: issue
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Issue domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type { IssueEntity } from "../domain/entities/Issue";

// ─── Lifecycle state machine ──────────────────────────────────────────────────

export type { IssueLifecycleStatus, IssueStage } from "../domain/value-objects/issue-state";

export {
  ISSUE_LIFECYCLE_STATUSES,
  ISSUE_STAGES,
  canTransitionIssue,
  isTerminalIssueStatus,
} from "../domain/value-objects/issue-state";

// ─── Domain events (cross-domain) ────────────────────────────────────────────

export type {
  IssueDomainEvent,
  IssueCreatedEvent,
  IssueStatusChangedEvent,
  IssueAssignedEvent,
  IssueResolvedEvent,
  IssueClosedEvent,
} from "../domain/events/issue.events";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getIssues } from "../interfaces/queries/issue.queries";
