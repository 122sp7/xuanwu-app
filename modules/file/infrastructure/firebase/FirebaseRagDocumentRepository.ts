import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type {
  RagDocumentRecord,
  RagDocumentRepository,
  RagDocumentStatus,
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

function buildKnowledgeDocumentsCollection(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
}) {
  return collection(
    getFirestore(firebaseClientApp),
    "knowledge_base",
    input.organizationId,
    "workspaces",
    input.workspaceId,
    "documents",
  );
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function toRagDocumentRecord(
  documentId: string,
  data: Record<string, unknown>,
  fallbackScope: { organizationId: string; workspaceId: string },
): RagDocumentRecord {
  return {
    id: documentId,
    organizationId:
      typeof data.organizationId === "string" ? data.organizationId : fallbackScope.organizationId,
    workspaceId:
      typeof data.workspaceId === "string" ? data.workspaceId : fallbackScope.workspaceId,
    displayName:
      (typeof data.displayName === "string" && data.displayName) ||
      (typeof data.sourceFileName === "string" && data.sourceFileName) ||
      "",
    title: typeof data.title === "string" ? data.title : "",
    sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
    mimeType:
      typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    status:
      data.status === "uploaded" ||
      data.status === "processing" ||
      data.status === "ready" ||
      data.status === "failed" ||
      data.status === "archived"
        ? data.status
        : "uploaded",
    statusMessage:
      typeof data.statusMessage === "string" ? data.statusMessage : undefined,
    checksum: typeof data.checksum === "string" ? data.checksum : undefined,
    taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    department: typeof data.department === "string" ? data.department : undefined,
    tags: toStringArray(data.tags),
    language: typeof data.language === "string" ? data.language : undefined,
    accessControl: toStringArray(data.accessControl),
    versionGroupId: typeof data.versionGroupId === "string" ? data.versionGroupId : documentId,
    versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 1,
    isLatest: typeof data.isLatest === "boolean" ? data.isLatest : true,
    updateLog: typeof data.updateLog === "string" ? data.updateLog : undefined,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    chunkCount: typeof data.chunkCount === "number" ? data.chunkCount : undefined,
    indexedAtISO:
      typeof data.indexedAtISO === "string" ? data.indexedAtISO : undefined,
    extractedTextStoragePath:
      typeof data.extractedTextStoragePath === "string" ? data.extractedTextStoragePath : undefined,
    extractedJsonStoragePath:
      typeof data.extractedJsonStoragePath === "string" ? data.extractedJsonStoragePath : undefined,
    expiresAtISO:
      typeof data.expiresAtISO === "string" ? data.expiresAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseRagDocumentRepository implements RagDocumentRepository {
  async findById(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly documentId: string;
  }): Promise<RagDocumentRecord | null> {
    const docRef = buildKnowledgeDocumentRef({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      documentId: scope.documentId,
    });
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return toRagDocumentRecord(snapshot.id, snapshot.data() as Record<string, unknown>, {
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
    });
  }

  async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null> {
    const snapshots = await getDocs(
      query(
        buildKnowledgeDocumentsCollection({
          organizationId: scope.organizationId,
          workspaceId: scope.workspaceId,
        }),
        where("storagePath", "==", scope.storagePath),
        limit(1),
      ),
    );
    const [firstMatch] = snapshots.docs;
    if (!firstMatch) {
      return null;
    }

    return toRagDocumentRecord(firstMatch.id, firstMatch.data() as Record<string, unknown>, {
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
    });
  }

  async findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]> {
    const snapshots = await getDocs(
      query(
        buildKnowledgeDocumentsCollection({
          organizationId: scope.organizationId,
          workspaceId: scope.workspaceId,
        }),
        orderBy("createdAtISO", "desc"),
      ),
    );

    return snapshots.docs.map((docSnap) =>
      toRagDocumentRecord(docSnap.id, docSnap.data() as Record<string, unknown>, {
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
      }),
    );
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
      displayName: record.displayName,
      title: record.title,
      sourceFileName: record.sourceFileName,
      mimeType: record.mimeType,
      storagePath: record.storagePath,
      sizeBytes: record.sizeBytes,
      status: record.status,
      ...(record.statusMessage ? { statusMessage: record.statusMessage } : {}),
      ...(record.checksum ? { checksum: record.checksum } : {}),
      ...(record.taxonomy ? { taxonomy: record.taxonomy } : {}),
      ...(record.category ? { category: record.category } : {}),
      ...(record.department ? { department: record.department } : {}),
      tags: record.tags ?? [],
      ...(record.language ? { language: record.language } : {}),
      accessControl: record.accessControl ?? [],
      versionGroupId: record.versionGroupId,
      versionNumber: record.versionNumber,
      isLatest: record.isLatest,
      ...(record.updateLog ? { updateLog: record.updateLog } : {}),
      accountId: record.accountId,
      ...(record.chunkCount !== undefined ? { chunkCount: record.chunkCount } : {}),
      ...(record.indexedAtISO ? { indexedAtISO: record.indexedAtISO } : {}),
      ...(record.expiresAtISO ? { expiresAtISO: record.expiresAtISO } : {}),
      createdAtISO: record.createdAtISO,
      updatedAtISO: record.updatedAtISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async updateStatus(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly documentId: string;
    readonly status: RagDocumentStatus;
    readonly statusMessage?: string;
  }): Promise<void> {
    const documentRef = buildKnowledgeDocumentRef({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      documentId: scope.documentId,
    });

    await setDoc(
      documentRef,
      {
        status: scope.status,
        ...(scope.statusMessage !== undefined ? { statusMessage: scope.statusMessage } : {}),
        updatedAtISO: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}
