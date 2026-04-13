/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/ports
 * Purpose: IFeedbackPort — output port for persisting quality feedback.
 *
 * Migration source: ai/domain/repositories/RagQueryFeedbackRepository.ts
 */

import type { QualityFeedback, SubmitFeedbackInput } from "../entities/QualityFeedback";

export interface IFeedbackPort {
  save(input: SubmitFeedbackInput): Promise<QualityFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<QualityFeedback[]>;
}
