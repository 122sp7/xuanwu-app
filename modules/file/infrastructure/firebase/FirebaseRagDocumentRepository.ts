import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

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
  async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null> {
    const snapshots = await getDocs(
      query(
        collection(
          getFirestore(firebaseClientApp),
          "knowledge_base",
          scope.organizationId,
          "workspaces",
          scope.workspaceId,
          "documents",
        ),
        where("storagePath", "==", scope.storagePath),
        limit(1),
      ),
    );
    const [firstMatch] = snapshots.docs;
    if (!firstMatch) {
      return null;
    }

    const data = firstMatch.data();
    return {
      id: firstMatch.id,
      organizationId: typeof data.organizationId === "string" ? data.organizationId : scope.organizationId,
      workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : scope.workspaceId,
      title: typeof data.title === "string" ? data.title : "",
      sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
      mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
      storagePath: typeof data.storagePath === "string" ? data.storagePath : scope.storagePath,
      status:
        data.status === "uploaded" ||
        data.status === "processing" ||
        data.status === "ready" ||
        data.status === "failed" ||
        data.status === "archived"
          ? data.status
          : "uploaded",
      checksum: typeof data.checksum === "string" ? data.checksum : undefined,
      taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : undefined,
      createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
      updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
    };
  }

  async saveUploaded(record: RagDocumentRecord): Promise<void> {
    const documentRef = buildKnowledgeDocumentRef({
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
      documentId: record.id,
    });

    await setDoc(documentRef, {
      // Duplicate the document id in the payload so collection-group consumers can project
      // a stable field without depending on Firestore snapshot metadata.
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
