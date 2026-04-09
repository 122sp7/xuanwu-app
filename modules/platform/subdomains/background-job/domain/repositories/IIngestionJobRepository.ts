/**
 * IIngestionJobRepository — output port (driven port) for ingestion job persistence.
 *
 * Implementations live in the adapters layer (InMemoryIngestionJobRepository,
 * FirebaseIngestionJobRepository, …). The domain core depends only on this interface.
 */

import type { IngestionJob, IngestionStatus } from "../entities/IngestionJob";

export interface IIngestionJobRepository {
  /** Retrieve a job by its associated document id. Returns null if not found. */
  findByDocumentId(documentId: string): Promise<IngestionJob | null>;

  /** List all jobs scoped to a specific workspace. */
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]>;

  /** Persist a new ingestion job. */
  save(job: IngestionJob): Promise<void>;

  /** Advance job status; returns the updated job, or null if the document was not found. */
  updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null>;
}
