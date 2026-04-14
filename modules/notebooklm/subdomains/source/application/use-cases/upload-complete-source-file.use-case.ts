/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadCompleteSourceFileUseCase — activates a file after binary upload completes.
 *
 * This is the second step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records
 *   2. complete (this) → activates the version and registers a RagDocumentRecord
 *
 * Idempotent: calling complete on an already-completed file returns the existing
 * RagDocument without creating a duplicate.
 */

import { v4 as randomUUID } from "@lib-uuid";

import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import { completeUploadSourceFile } from "../../domain/services/complete-upload-source-file.service";
import type {
  SourceFileCommandErrorCode,
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/source-file.dto";
import type { SourceFile } from "../../domain/entities/SourceFile";

type UploadCompleteSourceFileResult =
  | { ok: true; data: UploadCompleteFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

function isFileScopeMatch(params: {
  file: SourceFile;
  workspaceId: string;
  organizationId: string;
  actorAccountId: string;
  versionId: string;
}): boolean {
  return (
    params.file.workspaceId === params.workspaceId &&
    params.file.organizationId === params.organizationId &&
    params.file.accountId === params.actorAccountId &&
    params.file.currentVersionId === params.versionId
  );
}

function isFileAlreadyCompleted(file: SourceFile): boolean {
  return file.source === "file-upload-complete";
}

export class UploadCompleteSourceFileUseCase {
  constructor(
    private readonly fileRepository: SourceFileRepository,
    private readonly ragDocumentRepository: RagDocumentRepository,
  ) {}

  async execute(input: UploadCompleteFileInputDto): Promise<UploadCompleteSourceFileResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileId = input.fileId.trim();
    const versionId = input.versionId.trim();

    if (!workspaceId) return { ok: false, error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    if (!organizationId) return { ok: false, error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    if (!actorAccountId) return { ok: false, error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." } };
    if (!fileId) return { ok: false, error: { code: "FILE_ID_REQUIRED", message: "File id is required." } };
    if (!versionId) return { ok: false, error: { code: "FILE_VERSION_REQUIRED", message: "Version id is required." } };

    const file = await this.fileRepository.findById(fileId);
    if (!file) return { ok: false, error: { code: "FILE_NOT_FOUND", message: "File metadata not found." } };

    const version = await this.fileRepository.findVersion(fileId, versionId);
    if (!version) return { ok: false, error: { code: "FILE_VERSION_NOT_FOUND", message: "File version metadata not found." } };

    if (!isFileScopeMatch({ file, workspaceId, organizationId, actorAccountId, versionId })) {
      return { ok: false, error: { code: "FILE_SCOPE_MISMATCH", message: "Upload completion scope does not match file metadata." } };
    }

    if (file.status !== "active") {
      return { ok: false, error: { code: "FILE_STATUS_CONFLICT", message: "File upload completion requires an active file record." } };
    }

    const existingRagDocument = await this.ragDocumentRepository.findByStoragePath({
      organizationId,
      workspaceId,
      storagePath: version.storagePath,
    });

    const nextFile = isFileAlreadyCompleted(file)
      ? file
      : completeUploadSourceFile({ file, completedAtISO: new Date().toISOString() });

    if (!isFileAlreadyCompleted(file)) {
      await this.fileRepository.save(nextFile);
    }

    let ragDocumentId: string;
    let ragDocumentStatus: UploadCompleteFileOutputDto["ragDocumentStatus"];

    if (existingRagDocument !== null) {
      ragDocumentId = existingRagDocument.id;
      ragDocumentStatus = existingRagDocument.status;
    } else {
      const nowISO = new Date().toISOString();
      ragDocumentId = `rag-document-${randomUUID()}`;

      await this.ragDocumentRepository.saveUploaded({
        id: ragDocumentId,
        sourceFileId: nextFile.id,
        organizationId,
        workspaceId,
        accountId: actorAccountId,
        displayName: file.name,
        title: file.name,
        sourceFileName: file.name,
        mimeType: file.mimeType,
        storagePath: version.storagePath,
        sizeBytes: file.sizeBytes,
        status: "uploaded",
        checksum: version.checksum,
        versionGroupId: ragDocumentId,
        versionNumber: version.versionNumber,
        isLatest: true,
        createdAtISO: nowISO,
        updatedAtISO: nowISO,
      });

      ragDocumentStatus = "uploaded";
    }

    return {
      ok: true,
      data: {
        fileId: nextFile.id,
        versionId: nextFile.currentVersionId,
        status: "active",
        ragDocumentId,
        ragDocumentStatus,
      },
    };
  }
}
