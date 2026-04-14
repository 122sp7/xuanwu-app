/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseRagDocumentAdapter — Firestore implementation of RagDocumentRepository.
 *
 * Collection path:
 *   knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";

import type { RagDocumentRecord, RagDocumentStatus } from "../../../subdomains/source/domain/entities/RagDocument";
import type { RagDocumentRepository } from "../../../subdomains/source/domain/repositories/RagDocumentRepository";

function buildDocPath(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
}): string {
  return `knowledge_base/${input.organizationId}/workspaces/${input.workspaceId}/documents/${input.documentId}`;
}

function buildDocCollectionPath(input: { readonly organizationId: string; readonly workspaceId: string }): string {
  return `knowledge_base/${input.organizationId}/workspaces/${input.workspaceId}/documents`;
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function isRagDocumentStatus(value: unknown): value is RagDocumentStatus {
  return (
    value === "uploaded" ||
    value === "processing" ||
    value === "ready" ||
    value === "failed" ||
    value === "archived"
  );
}

function toRagDocumentRecord(
  documentId: string,
  data: Record<string, unknown>,
  fallback: { organizationId: string; workspaceId: string },
): RagDocumentRecord {
  return {
    id: documentId,
    organizationId: typeof data.organizationId === "string" ? data.organizationId : fallback.organizationId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : fallback.workspaceId,
    displayName:
      (typeof data.displayName === "string" && data.displayName) ||
      (typeof data.sourceFileName === "string" && data.sourceFileName) ||
      "",
    title: typeof data.title === "string" ? data.title : "",
    sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
    mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    status: isRagDocumentStatus(data.status) ? data.status : "uploaded",
    statusMessage: typeof data.statusMessage === "string" ? data.statusMessage : undefined,
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
    indexedAtISO: typeof data.indexedAtISO === "string" ? data.indexedAtISO : undefined,
    expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseRagDocumentAdapter implements RagDocumentRepository {
  async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null> {
    const documents = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      buildDocCollectionPath(scope),
      [{ field: "storagePath", op: "==", value: scope.storagePath }],
      { limit: 1 },
    );
    const [first] = documents;
    if (!first) return null;
    return toRagDocumentRecord(first.id, first.data, scope);
  }

  async findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]> {
    const documents = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      buildDocCollectionPath(scope),
      [],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return documents.map((document) =>
      toRagDocumentRecord(document.id, document.data, scope),
    );
  }

  async saveUploaded(record: RagDocumentRecord): Promise<void> {
    await firestoreInfrastructureApi.set(buildDocPath({ organizationId: record.organizationId, workspaceId: record.workspaceId, documentId: record.id }), {
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
    });
  }
}
