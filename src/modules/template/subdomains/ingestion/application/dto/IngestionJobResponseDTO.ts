/** IngestionJobResponseDTO — read model returned after a job is created or queried. */
export interface IngestionJobResponseDTO {
  jobId: string;
  sourceUrl: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}
