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
          | "RAG_TENANT_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
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
    const tenantId = input.tenantId.trim();
    const workspaceId = input.workspaceId.trim();
    const title = input.title.trim();
    const sourceFileName = input.sourceFileName.trim();
    const mimeType = input.mimeType.trim();
    const storagePath = input.storagePath.trim();

    if (!tenantId) {
      return {
        ok: false,
        error: { code: "RAG_TENANT_REQUIRED", message: "Tenant is required." },
      };
    }

    if (!workspaceId) {
      return {
        ok: false,
        error: { code: "RAG_WORKSPACE_REQUIRED", message: "Workspace is required." },
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

    await this.ragDocumentRepository.saveUploaded({
      id: documentId,
      tenantId,
      workspaceId,
      title,
      sourceFileName,
      mimeType,
      storagePath,
      status: "uploaded",
      checksum: input.checksum?.trim() || undefined,
      taxonomy: input.taxonomy?.trim() || undefined,
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
