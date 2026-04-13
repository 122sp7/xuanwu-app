/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadInitSourceFileUseCase — creates file metadata and returns an upload token.
 *
 * This is the first step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records, returns an upload URL token
 *   2. complete → marks the version as active, registers a RagDocumentRecord
 */

import { randomBytes, randomUUID } from "node:crypto";

import type { SourceFile } from "../../domain/entities/SourceFile";
import type { SourceFileVersion } from "../../domain/entities/SourceFileVersion";
import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type {
  SourceFileCommandErrorCode,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../dto/source-file.dto";

type UploadInitSourceFileResult =
  | { ok: true; data: UploadInitFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

function inferClassification(mimeType: string): SourceFile["classification"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.includes("json")) return "manifest";
  return "other";
}

function buildUploadPath(
  organizationId: string,
  workspaceId: string,
  fileId: string,
  fileName: string,
): string {
  const encodedName = encodeURIComponent(fileName.replace(/\s+/g, "-"));
  return `organizations/${organizationId}/workspaces/${workspaceId}/files/${fileId}/${encodedName}`;
}

export class UploadInitSourceFileUseCase {
  constructor(private readonly fileRepository: SourceFileRepository) {}

  async execute(input: UploadInitFileInputDto): Promise<UploadInitSourceFileResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileName = input.fileName.trim();

    if (!workspaceId) {
      return { ok: false, error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    }
    if (!organizationId) {
      return { ok: false, error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    }
    if (!actorAccountId) {
      return { ok: false, error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." } };
    }
    if (!fileName) {
      return { ok: false, error: { code: "FILE_NAME_REQUIRED", message: "File name is required." } };
    }
    if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
      return { ok: false, error: { code: "FILE_INVALID_SIZE", message: "File size must be a positive number." } };
    }

    const createdAtISO = new Date().toISOString();
    const fileId = `file-${randomUUID()}`;
    const versionId = `file-version-${randomUUID()}`;
    const uploadPath = buildUploadPath(organizationId, workspaceId, fileId, fileName);

    const file: SourceFile = {
      id: fileId,
      workspaceId,
      organizationId,
      accountId: actorAccountId,
      name: fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      classification: inferClassification(input.mimeType),
      tags: [],
      currentVersionId: versionId,
      status: "active",
      source: "file-upload-init",
      detail: "File metadata persisted before binary upload is completed.",
      createdAtISO,
      updatedAtISO: createdAtISO,
    };

    const version: SourceFileVersion = {
      id: versionId,
      fileId,
      versionNumber: 1,
      status: "pending",
      storagePath: uploadPath,
      createdAtISO,
    };

    await this.fileRepository.save(file, [version]);

    return {
      ok: true,
      data: {
        fileId,
        versionId,
        uploadPath,
        uploadToken: randomBytes(32).toString("base64url"),
        expiresAtISO: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    };
  }
}
