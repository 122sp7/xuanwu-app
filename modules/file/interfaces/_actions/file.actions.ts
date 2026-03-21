"use server";

import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentResult,
} from "../../application/dto/rag-document.dto";
import { RegisterUploadedRagDocumentUseCase } from "../../application/use-cases/register-uploaded-rag-document.use-case";
import { UploadCompleteFileUseCase } from "../../application/use-cases/upload-complete-file.use-case";
import { UploadInitFileUseCase } from "../../application/use-cases/upload-init-file.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";
import { FirebaseRagDocumentRepository } from "../../infrastructure/firebase/FirebaseRagDocumentRepository";
import type { FileCommandResult } from "../contracts/file-command-result";

function createCommandId(idempotencyKey?: string) {
  const normalized = idempotencyKey?.trim();
  if (normalized) {
    return normalized;
  }

  return `file-upload-init-${crypto.randomUUID()}`;
}

export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<FileCommandResult<UploadInitFileOutputDto>> {
  const commandId = createCommandId(input.idempotencyKey);
  const useCase = new UploadInitFileUseCase(new FirebaseFileRepository());
  const result = await useCase.execute(input);

  return {
    ...result,
    commandId,
  };
}

export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<FileCommandResult<UploadCompleteFileOutputDto>> {
  const useCase = new UploadCompleteFileUseCase(
    new FirebaseFileRepository(),
    new FirebaseRagDocumentRepository(),
  );
  const commandId = createCommandId(input.versionId);
  const result = await useCase.execute(input);

  return {
    ...result,
    commandId,
  };
}

export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult> {
  const useCase = new RegisterUploadedRagDocumentUseCase(new FirebaseRagDocumentRepository());
  const commandId = createCommandId(input.storagePath);
  const result = await useCase.execute(input);

  return {
    ...result,
    commandId,
  };
}

// ── Archive RAG Document ────────────────────────────────────────────────────

export interface ArchiveRagDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
}

export interface ArchiveRagDocumentResult {
  ok: boolean;
  error?: string;
}

/**
 * Archives a RAG document by setting its Firestore status to "archived".
 * Archived documents are excluded from RAG retrieval queries.
 */
export async function archiveRagDocument(
  input: ArchiveRagDocumentInput,
): Promise<ArchiveRagDocumentResult> {
  try {
    if (!input.documentId.trim()) {
      return { ok: false, error: "documentId is required" };
    }
    const repo = new FirebaseRagDocumentRepository();
    await repo.updateStatus({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      documentId: input.documentId,
      status: "archived",
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Archive failed",
    };
  }
}
