/**
 * @module workspace-flow/infrastructure/firebase
 * @file issue.converter.ts
 * @description Firestore document-to-entity converter for Issue.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Issue } from "../../domain/entities/Issue";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES, type IssueStage } from "../../domain/value-objects/IssueStage";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const VALID_STAGES = new Set<IssueStage>(ISSUE_STAGES);
const DEFAULT_STATUS: IssueStatus = "open";
const DEFAULT_STAGE: IssueStage = "task";

/**
 * Converts a raw Firestore document data map into a typed Issue entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toIssue(id: string, data: Record<string, unknown>): Issue {
  const rawStatus = data.status as IssueStatus;
  const rawStage = data.stage as IssueStage;
  return {
    id,
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    stage: VALID_STAGES.has(rawStage) ? rawStage : DEFAULT_STAGE,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    assignedTo: typeof data.assignedTo === "string" ? data.assignedTo : undefined,
    resolvedAtISO: typeof data.resolvedAtISO === "string" ? data.resolvedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
 
