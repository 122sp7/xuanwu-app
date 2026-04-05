import { randomUUID } from "node:crypto";

import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentOutputDto,
} from "../dto/rag-document.dto";

type RegisterUploadedRagDocumentUseCaseResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto }
  | {
      ok: false;
      error: {
        code:
          | "RAG_ORGANIZATION_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
          | "RAG_ACCOUNT_ID_REQUIRED"
          | "RAG_TITLE_REQUIRED"
          | "RAG_FILE_NAME_REQUIRED"
          | "RAG_MIME_TYPE_REQUIRED"
          | "RAG_STORAGE_PATH_REQUIRED";
        message: string;
      };
    };

export class RegisterUploadedRagDocumentUseCase {
  constructor(private readonly ragDocumentRepository: RagDocumentRepository) {}

  async execute(
    input: RegisterUploadedRagDocumentInputDto,
  ): Promise<RegisterUploadedRagDocumentUseCaseResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId.trim();
    const accountId = input.accountId.trim();
    const title = input.title.trim();
    const sourceFileName = input.sourceFileName.trim();
    const mimeType = input.mimeType.trim();
    const storagePath = input.storagePath.trim();

    if (!organizationId) {
      return {
        ok: false,
        error: { code: "RAG_ORGANIZATION_REQUIRED", message: "Organization is required." },
      };
    }

    if (!workspaceId) {
      return {
        ok: false,
        error: { code: "RAG_WORKSPACE_REQUIRED", message: "Workspace is required." },
      };
    }

    if (!accountId) {
      return {
        ok: false,
        error: { code: "RAG_ACCOUNT_ID_REQUIRED", message: "Account ID is required." },
      };
    }

    if (!title) {
      return {
        ok: false,
        error: { code: "RAG_TITLE_REQUIRED", message: "Document title is required." },
      };
    }

    if (!sourceFileName) {
      return {
        ok: false,
        error: { code: "RAG_FILE_NAME_REQUIRED", message: "Source file name is required." },
      };
    }

    if (!mimeType) {
      return {
        ok: false,
        error: { code: "RAG_MIME_TYPE_REQUIRED", message: "Mime type is required." },
      };
    }

    if (!storagePath) {
      return {
        ok: false,
        error: { code: "RAG_STORAGE_PATH_REQUIRED", message: "Storage path is required." },
      };
    }

    const nowISO = new Date().toISOString();
    const documentId = `rag-document-${randomUUID()}`;
    const versionGroupId = input.versionGroupId?.trim() ? input.versionGroupId.trim() : documentId;

    await this.ragDocumentRepository.saveUploaded({
      id: documentId,
      organizationId,
      workspaceId,
      accountId,
      displayName: sourceFileName,
      title,
      sourceFileName,
      mimeType,
      storagePath,
      sizeBytes: input.sizeBytes ?? 0,
      status: "uploaded",
      checksum: input.checksum?.trim() || undefined,
      taxonomy: input.taxonomy?.trim() || undefined,
      category: input.category?.trim() || undefined,
      department: input.department?.trim() || undefined,
      tags: input.tags ?? [],
      language: input.language?.trim() || undefined,
      accessControl: input.accessControl ?? [],
      versionGroupId,
      versionNumber: input.versionNumber ?? 1,
      isLatest: true,
      updateLog: input.updateLog?.trim() || undefined,
      expiresAtISO: input.expiresAtISO?.trim() || undefined,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    return {
      ok: true,
      data: {
        documentId,
        status: "uploaded",
        registeredAtISO: nowISO,
      },
    };
  }
}
