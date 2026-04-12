/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: application/use-cases
 * Purpose: SubmitRagQueryFeedbackUseCase — persists user quality signal on
 *          a RAG answer and returns a CommandResult.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { IRagQueryFeedbackRepository } from "../../domain/repositories/IRagQueryFeedbackRepository";
import type { RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../../domain/entities/rag-feedback.entities";

const VALID_RATINGS: RagFeedbackRating[] = ["helpful", "not_helpful", "partially_helpful"];

export class SubmitRagQueryFeedbackUseCase {
  constructor(private readonly feedbackRepository: IRagQueryFeedbackRepository) {}

  async execute(input: SubmitRagQueryFeedbackInput): Promise<CommandResult> {
    if (!input.traceId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_TRACE_ID_REQUIRED", "traceId is required.");
    }
    if (!input.organizationId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_ORG_REQUIRED", "organizationId is required.");
    }
    if (!input.submittedByUserId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_ACTOR_REQUIRED", "submittedByUserId is required.");
    }
    if (!VALID_RATINGS.includes(input.rating)) {
      return commandFailureFrom(
        "QA_FEEDBACK_INVALID_RATING",
        `rating must be one of: ${VALID_RATINGS.join(", ")}.`,
      );
    }

    try {
      const saved = await this.feedbackRepository.save({
        ...input,
        traceId: input.traceId.trim(),
        organizationId: input.organizationId.trim(),
        submittedByUserId: input.submittedByUserId.trim(),
      });
      return commandSuccess(saved.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "QA_FEEDBACK_PERSIST_ERROR",
        err instanceof Error ? err.message : "Failed to save feedback.",
      );
    }
  }
}
