/**
 * modules/retrieval — domain/repositories
 * Purpose: Port interface for RAG query feedback persistence.
 */

import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/RagQueryFeedback";

export interface RagQueryFeedbackRepository {
  /** Persist a new feedback record and return the persisted entity. */
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;

  /** Retrieve all feedback for a specific trace ID. */
  findByTraceId(traceId: string): Promise<RagQueryFeedback[]>;

  /** Retrieve recent feedback for an organization (for analytics). */
  listByOrganization(organizationId: string, limitCount?: number): Promise<RagQueryFeedback[]>;
}
