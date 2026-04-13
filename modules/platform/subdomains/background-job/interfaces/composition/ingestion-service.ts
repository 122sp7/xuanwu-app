/**
 * ingestionService — Composition root for knowledge ingestion use cases.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 *
 * Wires use cases to the default InMemoryIngestionJobRepository.
 * Swap the repository assignment here once a Firebase adapter is in place.
 *
 * This module is the single entry point for ingestion side-effects; adapters
 * (Server Actions, route handlers) must not reach into use cases directly.
 */

import type { IngestionJob } from "../../domain/entities/IngestionJob";
import type { IngestionStatus } from "../../domain/entities/IngestionJob";
import {
  RegisterIngestionDocumentUseCase,
  AdvanceIngestionStageUseCase,
  ListWorkspaceIngestionJobsUseCase,
  type IngestionResult,
  type RegisterIngestionDocumentInput,
  type AdvanceIngestionStageInput,
} from "../../application/use-cases/ingestion.use-cases";
import { InMemoryIngestionJobRepository } from "../../infrastructure/InMemoryIngestionJobRepository";

// Single shared repository instance for the lifetime of the module.
const defaultRepo = new InMemoryIngestionJobRepository();

export const ingestionService = {
  /**
   * Register a newly uploaded document and create an IngestionJob in
   * `uploaded` status, ready for the Python worker handoff.
   */
  registerDocument(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>> {
    return new RegisterIngestionDocumentUseCase(defaultRepo).execute(input);
  },

  /**
   * Advance the ingestion pipeline to the given status.
   * Rejects invalid transitions with `INGESTION_INVALID_STATUS_TRANSITION`.
   */
  advanceStage(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>> {
    return new AdvanceIngestionStageUseCase(defaultRepo).execute(input);
  },

  /**
   * Return all ingestion jobs belonging to a workspace.
   */
  listWorkspaceJobs(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return new ListWorkspaceIngestionJobsUseCase(defaultRepo).execute(input);
  },
} satisfies {
  registerDocument(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>>;
  advanceStage(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>>;
  listWorkspaceJobs(input: { readonly organizationId: string; readonly workspaceId: string }): Promise<readonly IngestionJob[]>;
};

// Re-export status type for convenience (callers using `ingestionService` should not
// need to reach into the domain layer directly).
export type { IngestionStatus };
