/**
 * FirestoreFileStorageRepository — Firestore-backed FileStorageRepository.
 *
 * Collection: storedFiles/{fileId}
 * Schema: mirrors StoredFile (flat document, no nesting).
 * Soft-delete: deletedAtISO is set on deletion; listByOwner excludes soft-deleted files.
 *
 * Composite index required:
 *   collection: storedFiles
 *   fields: ownerId ASC, deletedAtISO ASC
 *   mode: COLLECTION
 */

import { getFirebaseFirestore, firestoreApi } from "@packages";
import type { StoredFile } from "../../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../../domain/repositories/FileStorageRepository";

const FILES_COLLECTION = "storedFiles";

export class FirestoreFileStorageRepository implements FileStorageRepository {
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
