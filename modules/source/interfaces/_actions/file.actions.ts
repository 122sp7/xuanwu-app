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
import { KnowledgeIngestionApi } from "@/modules/ai/api";
import type { FileCommandResult } from "../contracts/file-command-result";

const knowledgeIngestionApi = new KnowledgeIngestionApi();

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
  const fileRepository = new FirebaseFileRepository();
  const useCase = new UploadCompleteFileUseCase(
    fileRepository,
    new FirebaseRagDocumentRepository(),
  );
  const commandId = createCommandId(input.versionId);
  const result = await useCase.execute(input);

  // Best-effort handoff: upload completion can proceed even if ingestion registration fails.
  if (result.ok) {
    const file = await fileRepository.findById(input.fileId);

    const registration = await knowledgeIngestionApi.registerDocument({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      sourceFileId: input.fileId,
      title: file?.name ?? `uploaded-file-${input.fileId}`,
      mimeType: file?.mimeType ?? "application/octet-stream",
    });

    if (!registration.ok && process.env.NODE_ENV !== "production") {
      console.warn(
        "[uploadCompleteFile] Knowledge ingestion registration failed:",
        registration.error.code,
        registration.error.message,
      );
    }
  }

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
