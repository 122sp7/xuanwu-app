"use server";

import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../../subdomains/source/application/dto/source-file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentResult,
} from "../../../subdomains/source/application/dto/rag-document.dto";
import { makeRagDocumentAdapter, makeSourceDocumentCommandAdapter, makeSourceFileAdapter } from "../../../subdomains/source/api/factories";
import { UploadInitSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-complete-source-file.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../../subdomains/source/application/use-cases/register-rag-document.use-case";
import { DeleteSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/delete-source-document.use-case";
import { RenameSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/rename-source-document.use-case";
import type { SourceFileCommandResult } from "../contracts/source-command-result";

function createCommandId(idempotencyKey?: string): string {
  const normalized = idempotencyKey?.trim();
  return normalized || `source-file-${crypto.randomUUID()}`;
}

export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<SourceFileCommandResult<UploadInitFileOutputDto>> {
  const commandId = createCommandId(input.idempotencyKey);
  const useCase = new UploadInitSourceFileUseCase(makeSourceFileAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<SourceFileCommandResult<UploadCompleteFileOutputDto>> {
  const commandId = createCommandId(input.versionId);
  const fileAdapter = makeSourceFileAdapter();
  const useCase = new UploadCompleteSourceFileUseCase(fileAdapter, makeRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult> {
  const commandId = createCommandId(input.storagePath);
  const useCase = new RegisterUploadedRagDocumentUseCase(makeRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function deleteSourceDocument(
  accountId: string,
  documentId: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-delete-${crypto.randomUUID()}`;
  const useCase = new DeleteSourceDocumentUseCase(makeSourceDocumentCommandAdapter());
  const result = await useCase.execute({ accountId, documentId });
  return { ...result, commandId };
}

export async function renameSourceDocument(
  accountId: string,
  documentId: string,
  newName: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-rename-${crypto.randomUUID()}`;
  const useCase = new RenameSourceDocumentUseCase(makeSourceDocumentCommandAdapter());
  const result = await useCase.execute({ accountId, documentId, newName });
  return { ...result, commandId };
}
