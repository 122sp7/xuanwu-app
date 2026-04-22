/**
 * firebase-composition — platform module outbound composition root.
 *
 * This file is a pure composition root. It:
 *   - Assembles use-case instances against FirestoreFileStorageRepository
 *   - Provides Firebase Storage upload/download helpers
 *
 * Infrastructure logic lives in the subdomain adapter:
 *   subdomains/file-storage/adapters/outbound/firestore/FirestoreFileStorageRepository.ts
 *
 * ESLint: @integration-firebase/storage is allowed here — this file lives at
 * src/modules/platform/adapters/outbound/ which matches the permitted glob.
 *
 * Storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 */

import { getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@packages";
import { FirestoreFileStorageRepository } from "../../subdomains/file-storage/adapters/outbound";
import {
  CreateStoredFileUseCase,
  GetStoredFileUseCase,
  ListStoredFilesUseCase,
  DeleteStoredFileUseCase,
} from "../../subdomains/file-storage/application/use-cases/FileStorageUseCases";

// ── Singleton ─────────────────────────────────────────────────────────────────

let _fileRepo: FirestoreFileStorageRepository | undefined;

function getFileRepo(): FirestoreFileStorageRepository {
  if (!_fileRepo) _fileRepo = new FirestoreFileStorageRepository();
  return _fileRepo;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createClientFileStorageUseCases() {
  const repo = getFileRepo();
  return {
    createStoredFile: new CreateStoredFileUseCase(repo),
    getStoredFile: new GetStoredFileUseCase(repo),
    listStoredFiles: new ListStoredFilesUseCase(repo),
    deleteStoredFile: new DeleteStoredFileUseCase(repo),
  };
}

// ── Client-side file storage helpers ─────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.
// The Firebase Web Client SDK requires a signed-in user in the browser context.
// A Server Action has no active Firebase user session → Firestore Security Rules
// block any operation (read or write) with "Missing or insufficient permissions".

export async function listWorkspaceFiles(params: { workspaceId: string }) {
  const { listStoredFiles } = createClientFileStorageUseCases();
  const files = await listStoredFiles.execute({ ownerId: params.workspaceId });
  return files.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
}

export async function registerUploadedFile(params: {
  workspaceId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
}) {
  const { createStoredFile } = createClientFileStorageUseCases();
  return createStoredFile.execute({
    ownerId: params.workspaceId,
    fileName: params.fileName,
    mimeType: params.mimeType,
    sizeBytes: params.sizeBytes,
    url: params.url,
  });
}

export async function deleteWorkspaceFile(params: { fileId: string }) {
  const { deleteStoredFile } = createClientFileStorageUseCases();
  await deleteStoredFile.execute({ fileId: params.fileId });
}

// ── Storage helpers ───────────────────────────────────────────────────────────

/**
 * uploadWorkspaceFile — upload a file to Firebase Storage under the workspace prefix.
 *
 * Default storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 * Custom prefix can be supplied as `options.prefix` to reuse this function for
 * other workspace-scoped paths (e.g. notebooklm sources under workspaces/).
 * Returns the GCS storage path (used as StoredFile.url).
 */
export async function uploadWorkspaceFile(
  file: File,
  accountId: string,
  workspaceId: string,
  options?: { prefix?: string },
): Promise<string> {
  const storage = getFirebaseStorage();
  const uuid = crypto.randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const prefix = options?.prefix ?? `workspace-files/${accountId}/${workspaceId}`;
  const path = `${prefix}/${uuid}-${safeName}`;
  const storageRef = ref(storage, path);
  const metadata = {
    customMetadata: {
      account_id: accountId,
      workspace_id: workspaceId,
      filename: file.name,
    },
  };
  await uploadBytes(storageRef, file, metadata);
  return path;
}

/**
 * getWorkspaceFileDownloadUrl — resolve a Firebase Storage path to an HTTPS download URL.
 *
 * Accepts both gs://bucket/path and relative paths like workspace-files/...
 */
export async function getWorkspaceFileDownloadUrl(storagePath: string): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, storagePath);
  return getDownloadURL(storageRef);
}
