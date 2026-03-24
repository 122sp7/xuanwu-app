/**
 * @module workspace-flow/domain/entities
 * @file Issue.ts
 * @description Issue aggregate entity representing a defect or anomaly raised during workflow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Issue {
  readonly id: string;
  readonly taskId: string;
  /** Which stage of the task workflow this issue was raised in. */
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo?: string;
  readonly resolvedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
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
