/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceFileAdapter — Firestore implementation of SourceFileRepository.
 *
 * Collections:
 *   workspaceFiles/{fileId}
 *   workspaceFiles/{fileId}/versions/{versionId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";

import type { SourceFile } from "../../../subdomains/source/domain/entities/SourceFile";
import type { SourceFileVersion } from "../../../subdomains/source/domain/entities/SourceFileVersion";
import type { SourceFileRepository, ListSourceFilesScope } from "../../../subdomains/source/domain/repositories/SourceFileRepository";

const FILE_COLLECTION = "workspaceFiles";
const VERSION_SUBCOLLECTION = "versions";

function isSourceFileStatus(value: unknown): value is SourceFile["status"] {
  return value === "active" || value === "archived" || value === "deleted";
}

function isSourceFileClassification(value: unknown): value is SourceFile["classification"] {
  return value === "image" || value === "manifest" || value === "record" || value === "other";
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toSourceFileEntity(fileId: string, data: Record<string, unknown>): SourceFile {
  return {
    id: fileId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    classification: isSourceFileClassification(data.classification) ? data.classification : "other",
    tags: toStringArray(data.tags),
    currentVersionId: typeof data.currentVersionId === "string" ? data.currentVersionId : "",
    retentionPolicyId: typeof data.retentionPolicyId === "string" ? data.retentionPolicyId : undefined,
    status: isSourceFileStatus(data.status) ? data.status : "active",
    source: typeof data.source === "string" ? data.source : undefined,
    detail: typeof data.detail === "string" ? data.detail : undefined,
    href: typeof data.href === "string" ? data.href : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
    deletedAtISO: typeof data.deletedAtISO === "string" ? data.deletedAtISO : undefined,
  };
}

function isVersionStatus(value: unknown): value is SourceFileVersion["status"] {
  return value === "pending" || value === "stored" || value === "active" || value === "superseded";
}

function toSourceFileVersionEntity(versionId: string, data: Record<string, unknown>): SourceFileVersion {
  return {
    id: versionId,
    fileId: typeof data.fileId === "string" ? data.fileId : "",
    versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 0,
    status: isVersionStatus(data.status) ? data.status : "pending",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    checksum: typeof data.checksum === "string" ? data.checksum : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseSourceFileAdapter implements SourceFileRepository {
  async findById(fileId: string): Promise<SourceFile | null> {
    const normalizedId = fileId.trim();
    if (!normalizedId) return null;
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      `${FILE_COLLECTION}/${normalizedId}`,
    );
    if (!data) return null;
    return toSourceFileEntity(normalizedId, data);
  }

  async findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null> {
    const nFileId = fileId.trim();
    const nVersionId = versionId.trim();
    if (!nFileId || !nVersionId) return null;
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      `${FILE_COLLECTION}/${nFileId}/${VERSION_SUBCOLLECTION}/${nVersionId}`,
    );
    if (!data) return null;
    return toSourceFileVersionEntity(nVersionId, data);
  }

  async listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    if (!workspaceId) return [];

    const documents = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      FILE_COLLECTION,
      [
        { field: "workspaceId", op: "==", value: workspaceId },
        { field: "organizationId", op: "==", value: organizationId },
      ],
    );

    return documents
      .map((document) => toSourceFileEntity(document.id, document.data))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(file: SourceFile, versions: readonly SourceFileVersion[] = []): Promise<void> {
    const writes: { path: string; data: Record<string, unknown> }[] = [
      {
        path: `${FILE_COLLECTION}/${file.id}`,
        data: {
          workspaceId: file.workspaceId,
          organizationId: file.organizationId,
          accountId: file.accountId,
          name: file.name,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          classification: file.classification,
          tags: [...file.tags],
          currentVersionId: file.currentVersionId,
          ...(file.retentionPolicyId ? { retentionPolicyId: file.retentionPolicyId } : {}),
          status: file.status,
          ...(file.source ? { source: file.source } : {}),
          ...(file.detail ? { detail: file.detail } : {}),
          ...(file.href ? { href: file.href } : {}),
          createdAtISO: file.createdAtISO,
          updatedAtISO: file.updatedAtISO,
          ...(file.deletedAtISO ? { deletedAtISO: file.deletedAtISO } : {}),
        },
      },
    ];

    for (const version of versions) {
      writes.push({
        path: `${FILE_COLLECTION}/${file.id}/${VERSION_SUBCOLLECTION}/${version.id}`,
        data: {
          fileId: version.fileId,
          versionNumber: version.versionNumber,
          status: version.status,
          storagePath: version.storagePath,
          ...(version.checksum ? { checksum: version.checksum } : {}),
          createdAtISO: version.createdAtISO,
        },
      });
    }

    await firestoreInfrastructureApi.setMany(writes);
  }
}
