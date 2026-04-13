/**
 * InMemoryIngestionJobRepository — default in-process adapter implementing IngestionJobRepository.
 *
 * Suitable for development environments and unit tests. Scoped to a single
 * process lifetime (data is lost on restart).
 *
 * Replace with FirebaseIngestionJobRepository for production persistence.
 */

import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../domain/repositories/IngestionJobRepository";

export class InMemoryIngestionJobRepository implements IngestionJobRepository {
  /** Keyed by document.id for O(1) lookups. */
  private readonly store = new Map<string, IngestionJob>();

  async findByDocumentId(documentId: string): Promise<IngestionJob | null> {
    return this.store.get(documentId) ?? null;
  }

  async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return [...this.store.values()].filter(
      (job) =>
        job.document.organizationId === input.organizationId &&
        job.document.workspaceId    === input.workspaceId,
    );
  }

  async save(job: IngestionJob): Promise<void> {
    this.store.set(job.document.id, job);
  }

  async updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null> {
    const current = this.store.get(input.documentId);
    if (!current) return null;

    const updated: IngestionJob = {
      ...current,
      status:        input.status,
      statusMessage: input.statusMessage,
      updatedAtISO:  input.updatedAtISO,
      document: {
        ...current.document,
        updatedAtISO: input.updatedAtISO,
      },
    };

    this.store.set(input.documentId, updated);
    return updated;
  }
}
