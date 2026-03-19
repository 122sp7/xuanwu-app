import type { File } from "../../domain/entities/File";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import { completeUploadFile } from "../../domain/services/complete-upload-file";
import type { FileCommandErrorCode } from "../../interfaces/contracts/file-command-result";
import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/file.dto";

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
  constructor(private readonly fileRepository: FileRepository) {}

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

    const nextFile = completeUploadFile({
      file,
      completedAtISO: new Date().toISOString(),
    });

    await this.fileRepository.save(nextFile);

    return {
      ok: true,
      data: {
        fileId: nextFile.id,
        versionId: nextFile.currentVersionId,
        status: "active",
      },
    };
  }
}
