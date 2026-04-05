/**
 * modules/search — domain/entities
 * Purpose: RagQueryFeedback — captures user signal on RAG answer quality.
 *
 * This entity records whether a generated answer was helpful or not,
 * enabling continuous improvement of the RAG pipeline.
 *
 * Firestore path: ragQueryFeedback/{feedbackId}
 */

export type RagFeedbackRating = "helpful" | "not_helpful" | "partially_helpful";

export interface RagQueryFeedback {
  /** Unique identifier for this feedback record */
  readonly id: string;
  /** The trace ID from the RAG answer that generated this feedback */
  readonly traceId: string;
  /** The original user query */
  readonly userQuery: string;
  /** Organization scope of the query */
  readonly organizationId: string;
  /** Optional workspace scope */
  readonly workspaceId?: string;
  /** User's rating of the answer quality */
  readonly rating: RagFeedbackRating;
  /** Optional free-text comment from the user */
  readonly comment?: string;
  /** ID of the user submitting feedback */
  readonly submittedByUserId: string;
  /** ISO 8601 timestamp */
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
