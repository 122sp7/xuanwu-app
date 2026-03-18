import { randomBytes, randomUUID } from "node:crypto";

import type { File } from "../../domain/entities/File";
import type { FileVersion } from "../../domain/entities/FileVersion";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import type {
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../dto/file.dto";
import type { FileCommandErrorCode } from "../../interfaces/contracts/file-command-result";

type UploadInitFileUseCaseResult =
  | { ok: true; data: UploadInitFileOutputDto }
  | { ok: false; error: { code: FileCommandErrorCode; message: string } };

function inferClassification(mimeType: string): File["classification"] {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.includes("json")) {
    return "manifest";
  }

  return "other";
}

function buildUploadPath(workspaceId: string, fileId: string, fileName: string) {
  const encodedName = encodeURIComponent(fileName.replace(/\s+/g, "-"));
  return `workspaces/${workspaceId}/files/${fileId}/${encodedName}`;
}

export class UploadInitFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(input: UploadInitFileInputDto): Promise<UploadInitFileUseCaseResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileName = input.fileName.trim();

    if (!workspaceId) {
      return {
        ok: false,
        error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." },
      };
    }

    if (!organizationId) {
      return {
        ok: false,
        error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." },
      };
    }

    if (!actorAccountId) {
      return {
        ok: false,
        error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." },
      };
    }

    if (!fileName) {
      return {
        ok: false,
        error: { code: "FILE_NAME_REQUIRED", message: "File name is required." },
      };
    }

    if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
      return {
        ok: false,
        error: { code: "FILE_INVALID_SIZE", message: "File size must be a positive number." },
      };
    }

    const createdAtISO = new Date().toISOString();
    const fileId = `file-${randomUUID()}`;
    const versionId = `file-version-${randomUUID()}`;
    const uploadPath = buildUploadPath(workspaceId, fileId, fileName);

    const file: File = {
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

    const version: FileVersion = {
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
