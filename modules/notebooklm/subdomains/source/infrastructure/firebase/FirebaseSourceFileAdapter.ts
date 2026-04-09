/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceFileAdapter — Firestore implementation of ISourceFileRepository.
 *
 * Collections:
 *   workspaceFiles/{fileId}
 *   workspaceFiles/{fileId}/versions/{versionId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { SourceFile } from "../../domain/entities/SourceFile";
import type { SourceFileVersion } from "../../domain/entities/SourceFileVersion";
import type { ISourceFileRepository, ListSourceFilesScope } from "../../domain/repositories/ISourceFileRepository";

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

export class FirebaseSourceFileAdapter implements ISourceFileRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, FILE_COLLECTION);
  }

  async findById(fileId: string): Promise<SourceFile | null> {
    const normalizedId = fileId.trim();
    if (!normalizedId) return null;
    const snapshot = await getDoc(doc(this.db, FILE_COLLECTION, normalizedId));
    if (!snapshot.exists()) return null;
    return toSourceFileEntity(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  async findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null> {
    const nFileId = fileId.trim();
    const nVersionId = versionId.trim();
    if (!nFileId || !nVersionId) return null;
    const snapshot = await getDoc(
      doc(this.db, FILE_COLLECTION, nFileId, VERSION_SUBCOLLECTION, nVersionId),
    );
    if (!snapshot.exists()) return null;
    return toSourceFileVersionEntity(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  async listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    if (!workspaceId) return [];

    const snapshots = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        where("organizationId", "==", organizationId),
      ),
    );

    return snapshots.docs
      .map((snap) => toSourceFileEntity(snap.id, snap.data() as Record<string, unknown>))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(file: SourceFile, versions: readonly SourceFileVersion[] = []): Promise<void> {
    const batch = writeBatch(this.db);
    const fileRef = doc(this.db, FILE_COLLECTION, file.id);

    batch.set(fileRef, {
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
    });

    for (const version of versions) {
      batch.set(doc(fileRef, VERSION_SUBCOLLECTION, version.id), {
        fileId: version.fileId,
        versionNumber: version.versionNumber,
        status: version.status,
        storagePath: version.storagePath,
        ...(version.checksum ? { checksum: version.checksum } : {}),
        createdAtISO: version.createdAtISO,
      });
    }

    await batch.commit();
  }
}
