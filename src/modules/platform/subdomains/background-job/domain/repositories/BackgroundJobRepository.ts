import type { BackgroundJob, BackgroundJobStatus } from "../entities/BackgroundJob";

export interface BackgroundJobRepository {
  findByDocumentId(documentId: string): Promise<BackgroundJob | null>;
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;
  save(job: BackgroundJob): Promise<void>;
  updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
}
