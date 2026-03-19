import type { File } from "../../domain/entities/File";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import { completeUploadFile } from "../../domain/services/complete-upload-file";
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import type { FileCommandErrorCode } from "../../interfaces/contracts/file-command-result";
import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/file.dto";
import { RegisterUploadedRagDocumentUseCase } from "./register-uploaded-rag-document.use-case";

type UploadCompleteFileUseCaseResult =
  | { ok: true; data: UploadCompleteFileOutputDto }
  | { ok: false; error: { code: FileCommandErrorCode; message: string } };

function isFileScopeMatch(input: {
  readonly file: File;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly versionId: string;
}): boolean {
  return (
    input.file.workspaceId === input.workspaceId &&
    input.file.organizationId === input.organizationId &&
    input.file.accountId === input.actorAccountId &&
    input.file.currentVersionId === input.versionId
  );
}

export class UploadCompleteFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly ragDocumentRepository: RagDocumentRepository,
  ) {}

  async execute(input: UploadCompleteFileInputDto): Promise<UploadCompleteFileUseCaseResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileId = input.fileId.trim();
    const versionId = input.versionId.trim();

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

    if (!fileId) {
      return {
        ok: false,
        error: { code: "FILE_ID_REQUIRED", message: "File id is required." },
      };
    }

    if (!versionId) {
      return {
        ok: false,
        error: { code: "FILE_VERSION_REQUIRED", message: "Version id is required." },
      };
    }

    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      return {
        ok: false,
        error: { code: "FILE_NOT_FOUND", message: "File metadata not found." },
      };
    }

    const version = await this.fileRepository.findVersion(fileId, versionId);
    if (!version) {
      return {
        ok: false,
        error: { code: "FILE_VERSION_NOT_FOUND", message: "File version metadata not found." },
      };
    }

    if (
      !isFileScopeMatch({
        file,
        workspaceId,
        organizationId,
        actorAccountId,
        versionId,
      })
    ) {
      return {
        ok: false,
        error: {
          code: "FILE_SCOPE_MISMATCH",
          message: "Upload completion scope does not match file metadata.",
        },
      };
    }

    if (file.status !== "active") {
      return {
        ok: false,
        error: {
          code: "FILE_STATUS_CONFLICT",
          message: "File upload completion requires an active file record.",
        },
      };
    }

    if (file.source === "file-upload-complete") {
      return {
        ok: false,
        error: {
          code: "FILE_STATUS_CONFLICT",
          message: "File upload completion has already been finalized for this version.",
        },
      };
    }

    const nextFile = completeUploadFile({
      file,
      completedAtISO: new Date().toISOString(),
    });

    await this.fileRepository.save(nextFile);

    const registerUploadedRagDocumentUseCase = new RegisterUploadedRagDocumentUseCase(
      this.ragDocumentRepository,
    );
    const ragDocumentResult = await registerUploadedRagDocumentUseCase.execute({
      organizationId,
      workspaceId,
      title: file.name,
      sourceFileName: file.name,
      mimeType: file.mimeType,
      storagePath: version.storagePath,
      checksum: version.checksum,
    });
    if (!ragDocumentResult.ok) {
      return {
        ok: false,
        error: {
          code: "FILE_RAG_REGISTRATION_FAILED",
          message: ragDocumentResult.error.message,
        },
      };
    }

    return {
      ok: true,
      data: {
        fileId: nextFile.id,
        versionId: nextFile.currentVersionId,
        status: "active",
        ragDocumentId: ragDocumentResult.data.documentId,
        ragDocumentStatus: ragDocumentResult.data.status,
      },
    };
  }
}
