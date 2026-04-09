/**
 * Module: notebooklm/subdomains/ai/qa
 * Layer: domain/repositories
 * Purpose: IRagQueryFeedbackRepository — output port for persisting feedback.
 */

import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/rag-feedback.entities";

export interface IRagQueryFeedbackRepository {
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>;
}
