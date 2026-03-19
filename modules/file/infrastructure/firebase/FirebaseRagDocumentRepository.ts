import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";

import type {
  RagDocumentRecord,
  RagDocumentRepository,
} from "../../domain/repositories/RagDocumentRepository";

const DOCUMENT_COLLECTION = "documents";

export class FirebaseRagDocumentRepository implements RagDocumentRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async saveUploaded(record: RagDocumentRecord): Promise<void> {
    const documentRef = doc(this.db, DOCUMENT_COLLECTION, record.id);

    await setDoc(documentRef, {
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
      title: record.title,
      sourceFileName: record.sourceFileName,
      mimeType: record.mimeType,
      storagePath: record.storagePath,
      status: record.status,
      ...(record.checksum ? { checksum: record.checksum } : {}),
      ...(record.taxonomy ? { taxonomy: record.taxonomy } : {}),
      createdAtISO: record.createdAtISO,
      updatedAtISO: record.updatedAtISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
