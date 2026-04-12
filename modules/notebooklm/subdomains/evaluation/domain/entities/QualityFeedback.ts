/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/entities
 * Purpose: QualityFeedback — user-quality signal on generated answers.
 *
 * Migration source: ai/domain/entities/rag-feedback.entities.ts
 */

export type FeedbackRating = "helpful" | "not_helpful" | "partially_helpful";

export interface QualityFeedback {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: FeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export interface SubmitFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: FeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
