import type { BackgroundJob, BackgroundJobStatus } from "../../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../../domain/repositories/BackgroundJobRepository";

export class InMemoryBackgroundJobRepository implements BackgroundJobRepository {
  private readonly store = new Map<string, BackgroundJob>();

  async findByDocumentId(documentId: string): Promise<BackgroundJob | null> {
    return this.store.get(documentId) ?? null;
  }

  async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]> {
    return [...this.store.values()].filter(
      (job) =>
        job.document.organizationId === input.organizationId &&
        job.document.workspaceId === input.workspaceId,
    );
  }

  async save(job: BackgroundJob): Promise<void> {
    this.store.set(job.document.id, job);
  }

  async updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null> {
    const current = this.store.get(input.documentId);
    if (!current) return null;

    const updated: BackgroundJob = {
      ...current,
      status: input.status,
      statusMessage: input.statusMessage,
      updatedAtISO: input.updatedAtISO,
      document: {
        ...current.document,
        updatedAtISO: input.updatedAtISO,
      },
    };

    this.store.set(input.documentId, updated);
    return updated;
  }
}
