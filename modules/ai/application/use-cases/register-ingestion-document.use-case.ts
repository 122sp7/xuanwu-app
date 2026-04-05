import { randomUUID } from "node:crypto";

import type { IngestionDocument } from "../../domain/entities/IngestionDocument";
import type { IngestionJob } from "../../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../../domain/repositories/IngestionJobRepository";

export interface RegisterIngestionDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}

export type RegisterIngestionDocumentResult =
  | { ok: true; data: IngestionJob }
  | { ok: false; error: { code: string; message: string } };

export class RegisterIngestionDocumentUseCase {
  constructor(private readonly ingestionJobRepository: IngestionJobRepository) {}

  async execute(input: RegisterIngestionDocumentInput): Promise<RegisterIngestionDocumentResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId.trim();
    const sourceFileId = input.sourceFileId.trim();
    const title = input.title.trim();
    const mimeType = input.mimeType.trim();

    if (!organizationId) {
      return { ok: false, error: { code: "KN_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    }

    if (!workspaceId) {
      return { ok: false, error: { code: "KN_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    }

    if (!sourceFileId) {
      return { ok: false, error: { code: "KN_SOURCE_FILE_REQUIRED", message: "Source file id is required." } };
    }

    if (!title) {
      return { ok: false, error: { code: "KN_TITLE_REQUIRED", message: "Document title is required." } };
    }

    if (!mimeType) {
      return { ok: false, error: { code: "KN_MIME_TYPE_REQUIRED", message: "Mime type is required." } };
    }

    const now = new Date().toISOString();
    const document: IngestionDocument = {
      id: randomUUID(),
      organizationId,
      workspaceId,
      sourceFileId,
      title,
      mimeType,
      createdAtISO: now,
      updatedAtISO: now,
    };

    const job: IngestionJob = {
      id: randomUUID(),
      document,
      status: "uploaded",
      updatedAtISO: now,
    };

    await this.ingestionJobRepository.save(job);

    return { ok: true, data: job };
  }
}
