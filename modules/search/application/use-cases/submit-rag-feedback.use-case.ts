/**
 * modules/search — application/use-cases
 * Purpose: SubmitRagQueryFeedbackUseCase — persists user feedback on a RAG
 *          answer and returns a CommandResult.
 *
 * This closes the RAG feedback loop:
 *   User rates answer → SubmitRagQueryFeedbackUseCase → Firestore
 *   → analytics / fine-tuning pipeline can consume
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import { v7 as generateId } from "@lib-uuid";

import type { RagQueryFeedbackRepository } from "../../domain/repositories/RagQueryFeedbackRepository";
import type { SubmitRagQueryFeedbackInput, RagFeedbackRating } from "../../domain/entities/RagQueryFeedback";

const VALID_RATINGS: RagFeedbackRating[] = ["helpful", "not_helpful", "partially_helpful"];

export class SubmitRagQueryFeedbackUseCase {
  constructor(private readonly feedbackRepo: RagQueryFeedbackRepository) {}

  async execute(input: SubmitRagQueryFeedbackInput): Promise<CommandResult> {
    // Validate required fields
    if (!input.traceId?.trim()) {
      return commandFailureFrom("RAG_FEEDBACK_INVALID_INPUT", "traceId is required.");
    }
    if (!input.organizationId?.trim()) {
      return commandFailureFrom("RAG_FEEDBACK_INVALID_INPUT", "organizationId is required.");
    }
    if (!input.submittedByUserId?.trim()) {
      return commandFailureFrom("RAG_FEEDBACK_INVALID_INPUT", "submittedByUserId is required.");
    }
    if (!VALID_RATINGS.includes(input.rating)) {
      return commandFailureFrom(
        "RAG_FEEDBACK_INVALID_RATING",
        `rating must be one of: ${VALID_RATINGS.join(", ")}.`,
      );
    }

    try {
      const feedback = await this.feedbackRepo.save({
        ...input,
        traceId: input.traceId.trim(),
        organizationId: input.organizationId.trim(),
        submittedByUserId: input.submittedByUserId.trim(),
      });
      return commandSuccess(feedback.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RAG_FEEDBACK_SAVE_FAILED",
        err instanceof Error ? err.message : "Unexpected error saving feedback.",
      );
    }
  }
}

/** Convenience factory for production wiring (used by Server Actions). */
export function createFeedbackId(): string {
  return generateId();
}
