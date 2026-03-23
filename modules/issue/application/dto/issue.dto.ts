/**
 * Module: issue
 * Layer: application/dto
 * Purpose: Zod-validated input DTOs for Issue use cases.
 *
 * IssueStage is a cross-domain type — imported here from the domain layer
 * and re-exported from this module's index.ts for other domains to import.
 */

import { z } from "@lib-zod";
import { ISSUE_LIFECYCLE_STATUSES, ISSUE_STAGES } from "../../domain/value-objects/issue-state";

// ── Shared ─────────────────────────────────────────────────────────────────────

export const IssueLifecycleStatusSchema = z.enum(ISSUE_LIFECYCLE_STATUSES);
export const IssueStageSchema = z.enum(ISSUE_STAGES);

// ── Create ─────────────────────────────────────────────────────────────────────

export const CreateIssueInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  /** Which domain context raised this issue. */
  stage: IssueStageSchema,
  /** The aggregate ID in the originating domain. */
  relatedId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  createdBy: z.string().min(1),
  assignedTo: z.string().min(1).optional(),
});

export type CreateIssueInputDto = z.infer<typeof CreateIssueInputSchema>;

// ── Update ─────────────────────────────────────────────────────────────────────

export const UpdateIssueInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  assignedTo: z.string().min(1).optional(),
});

export type UpdateIssueInputDto = z.infer<typeof UpdateIssueInputSchema>;

// ── Status transition ──────────────────────────────────────────────────────────

export const TransitionIssueStatusInputSchema = z.object({
  issueId: z.string().min(1),
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  to: IssueLifecycleStatusSchema,
});

export type TransitionIssueStatusInputDto = z.infer<typeof TransitionIssueStatusInputSchema>;
