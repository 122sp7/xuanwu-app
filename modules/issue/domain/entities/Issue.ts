/**
 * Module: issue
 * Layer: domain/entity
 * Purpose: Canonical IssueEntity — cross-domain supporting aggregate.
 *
 * Issues can be raised at any stage (task | qa | acceptance | finance).
 * IssueLifecycleStatus and IssueStage are defined in value-objects/issue-state.
 *
 * Design invariant:
 *   The originating domain (Task/QA/Acceptance/Finance) status NEVER moves
 *   backward because of an issue.  The Issue aggregate manages the separate
 *   fix/retest lifecycle.  On resolution, the Issue domain emits IssueResolvedEvent
 *   so the origin domain can resume its flow.
 */

import type { IssueLifecycleStatus, IssueStage } from "../value-objects/issue-state";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface IssueEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** Which domain context raised this issue. */
  readonly stage: IssueStage;
  /** ID of the related aggregate in the originating domain (taskId, testRunId, etc.). */
  readonly relatedId: string;
  readonly title: string;
  readonly description: string;
  readonly status: IssueLifecycleStatus;
  readonly createdBy: string;
  readonly assignedTo?: string;
  readonly resolvedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateIssueInput {
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly stage: IssueStage;
  readonly relatedId: string;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}

export interface UpdateIssueInput {
  readonly title?: string;
  readonly description?: string;
  readonly assignedTo?: string;
}
