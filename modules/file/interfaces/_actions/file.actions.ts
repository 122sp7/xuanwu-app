"use server";

import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/file.dto";
import { UploadCompleteFileUseCase } from "../../application/use-cases/upload-complete-file.use-case";
import { UploadInitFileUseCase } from "../../application/use-cases/upload-init-file.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";
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
  const useCase = new UploadCompleteFileUseCase(new FirebaseFileRepository());
  const commandId = createCommandId(input.versionId);
  const result = await useCase.execute(input);

  return {
    ...result,
    commandId,
  };
}
