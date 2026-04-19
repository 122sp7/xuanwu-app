"use server";

/**
 * task-formation-actions — Server Actions for AI task candidate extraction and confirmation.
 *
 * startExtractionAction: Creates a TaskFormationJob, runs extractor in Firebase-side workflow,
 *   persists candidates to Firestore, and returns the job snapshot (with candidates).
 *
 * confirmCandidatesAction: Takes selected candidate indices, creates Tasks in the
 *   workspace task subdomain, and records a candidates-confirmed domain event.
 */

import { z } from "zod";
import { ExtractTaskCandidatesSchema, ConfirmCandidatesSchema } from "../../../application/dto/TaskFormationDTO";
import { createClientTaskFormationUseCases } from "../../../../../adapters/outbound/firebase-composition";

// ── Actions ────────────────────────────────────────────────────────────────────

/**
 * Starts AI extraction for the given workspace and source pages.
 * Returns the CommandResult plus the full candidates list from the persisted job.
 */
export async function startExtractionAction(rawInput: unknown) {
  const input = ExtractTaskCandidatesSchema.parse(rawInput);
  const { extractTaskCandidates, getJobSnapshot } = createClientTaskFormationUseCases();
  const result = await extractTaskCandidates.execute(input);
  if (!result.success) return { ...result, candidates: [] };

  const snapshot = await getJobSnapshot(result.aggregateId);
  return { ...result, candidates: snapshot?.candidates ?? [] };
}

/**
 * Confirms selected candidates from a previously extracted job.
 * Creates Tasks in the workspace task subdomain for each confirmed candidate.
 */
export async function confirmCandidatesAction(rawInput: unknown) {
  const input = ConfirmCandidatesSchema.parse(rawInput);
  const { confirmCandidates } = createClientTaskFormationUseCases();
  return confirmCandidates.execute(input);
}

/**
 * Reads a previously extracted job snapshot (e.g. to restore reviewing state on page reload).
 */
export async function getTaskFormationJobSnapshotAction(rawInput: unknown) {
  const { jobId } = z.object({ jobId: z.string().uuid() }).parse(rawInput);
  const { getJobSnapshot } = createClientTaskFormationUseCases();
  return getJobSnapshot(jobId);
}
