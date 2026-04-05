import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../domain/repositories/IngestionJobRepository";

export class InMemoryIngestionJobRepository implements IngestionJobRepository {
  private readonly jobsByDocumentId = new Map<string, IngestionJob>();

  async findByDocumentId(documentId: string): Promise<IngestionJob | null> {
    return this.jobsByDocumentId.get(documentId) ?? null;
  }

  async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return [...this.jobsByDocumentId.values()].filter(
      (job) =>
        job.document.organizationId === input.organizationId &&
        job.document.workspaceId === input.workspaceId,
    );
  }

  async save(job: IngestionJob): Promise<void> {
    this.jobsByDocumentId.set(job.document.id, job);
  }

  async updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null> {
    const current = this.jobsByDocumentId.get(input.documentId);
    if (!current) {
      return null;
    }

    const updated: IngestionJob = {
      ...current,
      status: input.status,
      statusMessage: input.statusMessage,
      updatedAtISO: input.updatedAtISO,
      document: {
        ...current.document,
        updatedAtISO: input.updatedAtISO,
      },
    };

    this.jobsByDocumentId.set(input.documentId, updated);
    return updated;
  }
}
