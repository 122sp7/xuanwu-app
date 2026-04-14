/**
 * backgroundJobService — Composition root for knowledge ingestion use cases.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 *
 * Wires use cases to the default InMemoryBackgroundJobRepository.
 * Swap the repository assignment here once a Firebase adapter is in place.
 *
 * This module is the single entry point for ingestion side-effects; adapters
 * (Server Actions, route handlers) must not reach into use cases directly.
 */

import type { BackgroundJob } from "../../domain/entities/BackgroundJob";
import type { BackgroundJobStatus } from "../../domain/entities/BackgroundJob";
import {
  RegisterJobDocumentUseCase,
  AdvanceJobStageUseCase,
  ListWorkspaceJobsUseCase,
  type JobResult,
  type RegisterJobDocumentInput,
  type AdvanceJobStageInput,
} from "../../application/use-cases/background-job.use-cases";
import { InMemoryBackgroundJobRepository } from "../../infrastructure/InMemoryBackgroundJobRepository";

// Single shared repository instance for the lifetime of the module.
const defaultRepo = new InMemoryBackgroundJobRepository();

export const backgroundJobService = {
  /**
   * Register a newly uploaded document and create an BackgroundJob in
   * `uploaded` status, ready for the Python worker handoff.
   */
  registerDocument(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>> {
    return new RegisterJobDocumentUseCase(defaultRepo).execute(input);
  },

  /**
   * Advance the ingestion pipeline to the given status.
   * Rejects invalid transitions with `JOB_INVALID_STATUS_TRANSITION`.
   */
  advanceStage(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>> {
    return new AdvanceJobStageUseCase(defaultRepo).execute(input);
  },

  /**
   * Return all ingestion jobs belonging to a workspace.
   */
  listWorkspaceJobs(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]> {
    return new ListWorkspaceJobsUseCase(defaultRepo).execute(input);
  },
} satisfies {
  registerDocument(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>>;
  advanceStage(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>>;
  listWorkspaceJobs(input: { readonly organizationId: string; readonly workspaceId: string }): Promise<readonly BackgroundJob[]>;
};

// Re-export status type for convenience (callers using `backgroundJobService` should not
// need to reach into the domain layer directly).
export type { BackgroundJobStatus };
