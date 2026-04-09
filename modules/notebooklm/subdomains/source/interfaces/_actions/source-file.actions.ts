"use server";

import { deleteDoc, doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/source-file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentOutputDto,
  RegisterUploadedRagDocumentResult,
} from "../../application/dto/rag-document.dto";
import { UploadInitSourceFileUseCase } from "../../application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../application/use-cases/upload-complete-source-file.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../application/use-cases/register-rag-document.use-case";
import { FirebaseSourceFileAdapter } from "../../infrastructure/firebase/FirebaseSourceFileAdapter";
import { FirebaseRagDocumentAdapter } from "../../infrastructure/firebase/FirebaseRagDocumentAdapter";
import type { SourceFileCommandResult } from "../contracts/source-command-result";

function createCommandId(idempotencyKey?: string): string {
  const normalized = idempotencyKey?.trim();
  return normalized || `source-file-${crypto.randomUUID()}`;
}

export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<SourceFileCommandResult<UploadInitFileOutputDto>> {
  const commandId = createCommandId(input.idempotencyKey);
  const useCase = new UploadInitSourceFileUseCase(new FirebaseSourceFileAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<SourceFileCommandResult<UploadCompleteFileOutputDto>> {
  const commandId = createCommandId(input.versionId);
  const fileAdapter = new FirebaseSourceFileAdapter();
  const useCase = new UploadCompleteSourceFileUseCase(fileAdapter, new FirebaseRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult> {
  const commandId = createCommandId(input.storagePath);
  const useCase = new RegisterUploadedRagDocumentUseCase(new FirebaseRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function deleteSourceDocument(
  accountId: string,
  documentId: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-delete-${crypto.randomUUID()}`;
  if (!accountId.trim() || !documentId.trim()) {
    return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId and documentId are required." }, commandId };
  }
  try {
    const db = getFirestore(firebaseClientApp);
    await deleteDoc(doc(db, "accounts", accountId, "documents", documentId));
    return { ok: true, data: { documentId }, commandId };
  } catch (err) {
    return { ok: false, error: { code: "FILE_DELETE_FAILED", message: err instanceof Error ? err.message : "Delete failed." }, commandId };
  }
}

export async function renameSourceDocument(
  accountId: string,
  documentId: string,
  newName: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-rename-${crypto.randomUUID()}`;
  if (!accountId.trim() || !documentId.trim() || !newName.trim()) {
    return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId, documentId and newName are required." }, commandId };
  }
  try {
    const db = getFirestore(firebaseClientApp);
    await updateDoc(doc(db, "accounts", accountId, "documents", documentId), {
      title: newName,
      "source.filename": newName,
      "metadata.filename": newName,
      updatedAt: serverTimestamp(),
    });
    return { ok: true, data: { documentId }, commandId };
  } catch (err) {
    return { ok: false, error: { code: "FILE_RENAME_FAILED", message: err instanceof Error ? err.message : "Rename failed." }, commandId };
  }
}
