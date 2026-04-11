/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: RagQueryFeedback — captures user-quality signal on generated answers.
 */

export type RagFeedbackRating = "helpful" | "not_helpful" | "partially_helpful";

export interface RagQueryFeedback {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export interface SubmitRagQueryFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
