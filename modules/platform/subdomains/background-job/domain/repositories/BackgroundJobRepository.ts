/**
 * BackgroundJobRepository — output port (driven port) for background job persistence.
 *
 * Implementations live in the adapters layer (InMemoryBackgroundJobRepository,
 * FirebaseBackgroundJobRepository, …). The domain core depends only on this interface.
 */

import type { BackgroundJob, BackgroundJobStatus } from "../entities/BackgroundJob";

export interface BackgroundJobRepository {
  /** Retrieve a job by its associated document id. Returns null if not found. */
  findByDocumentId(documentId: string): Promise<BackgroundJob | null>;

  /** List all jobs scoped to a specific workspace. */
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;

  /** Persist a new background job. */
  save(job: BackgroundJob): Promise<void>;

  /** Advance job status; returns the updated job, or null if the document was not found. */
  updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
}
