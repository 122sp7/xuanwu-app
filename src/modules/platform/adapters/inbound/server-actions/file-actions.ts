"use server";

/**
 * file-actions — platform file storage server actions.
 *
 * Manages workspace-scoped file metadata in Firestore.
 * Actual binary upload is done client-side via uploadWorkspaceFile() (Firebase Storage).
 * These actions handle the metadata lifecycle only.
 */

import { z } from "zod";
import { createClientFileStorageUseCases } from "../../outbound/firebase-composition";

// ── Input schemas ─────────────────────────────────────────────────────────────

const ListWorkspaceFilesInputSchema = z.object({
  workspaceId: z.string().min(1),
});

const RegisterUploadedFileInputSchema = z.object({
  workspaceId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  url: z.string().min(1),
});

const DeleteWorkspaceFileInputSchema = z.object({
  fileId: z.string().min(1),
});

// ── Actions ───────────────────────────────────────────────────────────────────

/**
 * listWorkspaceFilesAction — list all (non-deleted) files for a workspace.
 * Returns StoredFile[] ordered by createdAtISO descending (client-sorted).
 */
export async function listWorkspaceFilesAction(rawInput: unknown) {
  const input = ListWorkspaceFilesInputSchema.parse(rawInput);
  const { listStoredFiles } = createClientFileStorageUseCases();
  const files = await listStoredFiles.execute({ ownerId: input.workspaceId });
  return files.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
}

/**
 * registerUploadedFileAction — register a file's metadata after client-side upload.
 *
 * Call this after uploadWorkspaceFile() completes on the client.
 * ownerId is set to workspaceId to scope the file to the workspace.
 */
export async function registerUploadedFileAction(rawInput: unknown) {
  const input = RegisterUploadedFileInputSchema.parse(rawInput);
  const { createStoredFile } = createClientFileStorageUseCases();
  return createStoredFile.execute({
    ownerId: input.workspaceId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    url: input.url,
  });
}

/**
 * deleteWorkspaceFileAction — soft-delete a stored file by fileId.
 * Sets deletedAtISO on the Firestore document; storage object is not removed.
 */
export async function deleteWorkspaceFileAction(rawInput: unknown) {
  const input = DeleteWorkspaceFileInputSchema.parse(rawInput);
  const { deleteStoredFile } = createClientFileStorageUseCases();
  await deleteStoredFile.execute({ fileId: input.fileId });
  return { success: true };
}
