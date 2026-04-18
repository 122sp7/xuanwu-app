/**
 * firebase-composition — platform module outbound composition root.
 *
 * Provides:
 *   - FirestoreFileStorageRepository  (Firestore-backed FileStorageRepository)
 *   - uploadWorkspaceFile()           (Firebase Storage upload for workspace files)
 *   - getWorkspaceFileDownloadUrl()   (resolve download URL from GCS path)
 *   - createClientFileStorageUseCases() (factory for use-case instances)
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/platform/adapters/outbound/ which matches the permitted glob.
 *
 * Firestore collection: storedFiles/{fileId}
 * Storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 */

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase";
import { getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@integration-firebase/storage";
import type { StoredFile } from "../../subdomains/file-storage/domain/entities/StoredFile";
import type { FileStorageRepository } from "../../subdomains/file-storage/domain/repositories/FileStorageRepository";
import {
  CreateStoredFileUseCase,
  GetStoredFileUseCase,
  ListStoredFilesUseCase,
  DeleteStoredFileUseCase,
} from "../../subdomains/file-storage/application/use-cases/FileStorageUseCases";

// ── Firestore repository ──────────────────────────────────────────────────────

const FILES_COLLECTION = "storedFiles";

/**
 * FirestoreFileStorageRepository — Firestore-backed implementation of FileStorageRepository.
 *
 * Document shape mirrors StoredFile (flat; no nesting required).
 * listByOwner queries by ownerId (= workspaceId) and excludes soft-deleted files.
 */
class FirestoreFileStorageRepository implements FileStorageRepository {
  private readonly db = getFirebaseFirestore();

  async save(file: StoredFile): Promise<void> {
    const { doc, setDoc } = firestoreApi;
    const docRef = doc(this.db, FILES_COLLECTION, file.fileId);
    await setDoc(docRef, {
      fileId: file.fileId,
      ownerId: file.ownerId,
      fileName: file.fileName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      url: file.url,
      createdAtISO: file.createdAtISO,
      deletedAtISO: file.deletedAtISO,
    });
  }

  async findById(fileId: string): Promise<StoredFile | null> {
    const { doc, getDoc } = firestoreApi;
    const docRef = doc(this.db, FILES_COLLECTION, fileId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as StoredFile;
  }

  async listByOwner(ownerId: string): Promise<StoredFile[]> {
    const { collection, query, where, getDocs } = firestoreApi;
    const q = query(
      collection(this.db, FILES_COLLECTION),
      where("ownerId", "==", ownerId),
      where("deletedAtISO", "==", null),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as StoredFile);
  }

  async delete(fileId: string): Promise<void> {
    const { doc, updateDoc } = firestoreApi;
    const docRef = doc(this.db, FILES_COLLECTION, fileId);
    await updateDoc(docRef, { deletedAtISO: new Date().toISOString() });
  }
}

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

// ── Storage helpers ───────────────────────────────────────────────────────────

/**
 * uploadWorkspaceFile — upload a file to Firebase Storage under the workspace prefix.
 *
 * Storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 * Returns the GCS storage path (used as StoredFile.url).
 */
export async function uploadWorkspaceFile(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string> {
  const storage = getFirebaseStorage();
  const uuid = crypto.randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `workspace-files/${accountId}/${workspaceId}/${uuid}-${safeName}`;
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
