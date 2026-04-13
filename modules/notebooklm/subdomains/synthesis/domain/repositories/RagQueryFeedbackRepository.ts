/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: RagQueryFeedbackRepository — output port for persisting feedback.
 */

import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/rag-feedback.entities";

export interface RagQueryFeedbackRepository {
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>;
}
