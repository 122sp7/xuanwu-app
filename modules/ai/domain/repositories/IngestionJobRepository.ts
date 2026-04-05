import type { IngestionJob, IngestionStatus } from "../entities/IngestionJob";

export interface IngestionJobRepository {
  findByDocumentId(documentId: string): Promise<IngestionJob | null>;
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]>;
  save(job: IngestionJob): Promise<void>;
  updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null>;
}
