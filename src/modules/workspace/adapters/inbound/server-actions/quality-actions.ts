"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientQualityUseCases } from "../../outbound/firebase-composition";
import type { QualityReviewSnapshot } from "../../../subdomains/quality/domain/entities/QualityReview";

const StartQualityReviewSchema = z.object({
  taskId: z.string().min(1),
  workspaceId: z.string().min(1),
  reviewerId: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

const ReviewNoteSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export async function startQualityReviewAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = StartQualityReviewSchema.parse(rawInput);
    const { startQualityReview } = createClientQualityUseCases();
    return startQualityReview.execute(input);
  } catch (err) {
    return commandFailureFrom("QA_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function passQualityReviewAction(reviewId: string, rawInput?: unknown): Promise<CommandResult> {
  try {
    const { notes } = rawInput ? ReviewNoteSchema.parse(rawInput) : { notes: undefined };
    const { passQualityReview } = createClientQualityUseCases();
    return passQualityReview.execute(reviewId, notes);
  } catch (err) {
    return commandFailureFrom("QA_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function failQualityReviewAction(reviewId: string, rawInput?: unknown): Promise<CommandResult> {
  try {
    const { notes } = rawInput ? ReviewNoteSchema.parse(rawInput) : { notes: undefined };
    const { failQualityReview } = createClientQualityUseCases();
    return failQualityReview.execute(reviewId, notes);
  } catch (err) {
    return commandFailureFrom("QA_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listQualityReviewsAction(workspaceId: string): Promise<QualityReviewSnapshot[]> {
  try {
    const { listQualityReviews } = createClientQualityUseCases();
    return listQualityReviews.execute(workspaceId);
  } catch {
    return [];
  }
}
