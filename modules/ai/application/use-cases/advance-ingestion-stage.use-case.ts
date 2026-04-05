import {
  canTransitionIngestionStatus,
  type IngestionJob,
  type IngestionStatus,
} from "../../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../../domain/repositories/IngestionJobRepository";

export interface AdvanceIngestionStageInput {
  readonly documentId: string;
  readonly nextStatus: IngestionStatus;
  readonly statusMessage?: string;
}

export type AdvanceIngestionStageResult =
  | { ok: true; data: IngestionJob }
  | { ok: false; error: { code: string; message: string } };

export class AdvanceIngestionStageUseCase {
  constructor(private readonly ingestionJobRepository: IngestionJobRepository) {}

  async execute(input: AdvanceIngestionStageInput): Promise<AdvanceIngestionStageResult> {
    const documentId = input.documentId.trim();

    if (!documentId) {
      return { ok: false, error: { code: "KN_DOCUMENT_REQUIRED", message: "Document id is required." } };
    }

    const job = await this.ingestionJobRepository.findByDocumentId(documentId);
    if (!job) {
      return { ok: false, error: { code: "KN_DOCUMENT_NOT_FOUND", message: "Ingestion document not found." } };
    }

    if (!canTransitionIngestionStatus(job.status, input.nextStatus)) {
      return {
        ok: false,
        error: {
          code: "KN_INVALID_STATUS_TRANSITION",
          message: `Cannot transition ingestion status from ${job.status} to ${input.nextStatus}.`,
        },
      };
    }

    const updated = await this.ingestionJobRepository.updateStatus({
      documentId,
      status: input.nextStatus,
      statusMessage: input.statusMessage,
      updatedAtISO: new Date().toISOString(),
    });

    if (!updated) {
      return { ok: false, error: { code: "KN_UPDATE_FAILED", message: "Failed to update ingestion status." } };
    }

    return { ok: true, data: updated };
  }
}
