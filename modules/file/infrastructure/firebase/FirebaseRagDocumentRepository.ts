import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";

import type {
  RagDocumentRecord,
  RagDocumentRepository,
} from "../../domain/repositories/RagDocumentRepository";

function buildKnowledgeDocumentRef(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
}) {
  return doc(
    getFirestore(firebaseClientApp),
    "knowledge_base",
    input.organizationId,
    "workspaces",
    input.workspaceId,
    "documents",
    input.documentId,
  );
}

export class FirebaseRagDocumentRepository implements RagDocumentRepository {
  async saveUploaded(record: RagDocumentRecord): Promise<void> {
    const documentRef = buildKnowledgeDocumentRef({
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
      documentId: record.id,
    });

    await setDoc(documentRef, {
      id: record.id,
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
