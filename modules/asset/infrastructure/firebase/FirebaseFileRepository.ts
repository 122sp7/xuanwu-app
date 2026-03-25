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

import type { File } from "../../domain/entities/File";
import type { FileVersion } from "../../domain/entities/FileVersion";
import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";

const FILE_COLLECTION = "workspaceFiles";
const VERSION_SUBCOLLECTION = "versions";

interface FirestoreFileDocument {
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly accountId?: string;
  readonly name?: string;
  readonly mimeType?: string;
  readonly sizeBytes?: number;
  readonly classification?: File["classification"];
  readonly tags?: readonly string[];
  readonly currentVersionId?: string;
  readonly retentionPolicyId?: string;
  readonly status?: File["status"];
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO?: string;
  readonly updatedAtISO?: string;
  readonly deletedAtISO?: string;
}

interface FirestoreFileVersionDocument {
  readonly fileId?: string;
  readonly versionNumber?: number;
  readonly status?: FileVersion["status"];
  readonly storagePath?: string;
  readonly checksum?: string;
  readonly createdAtISO?: string;
}

function isFileStatus(value: unknown): value is File["status"] {
  return value === "active" || value === "archived" || value === "deleted";
}

function isFileClassification(value: unknown): value is File["classification"] {
  return value === "image" || value === "manifest" || value === "record" || value === "other";
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toFileEntity(fileId: string, data: FirestoreFileDocument): File {
  return {
    id: fileId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    classification: isFileClassification(data.classification) ? data.classification : "other",
    tags: toStringArray(data.tags),
    currentVersionId: typeof data.currentVersionId === "string" ? data.currentVersionId : "",
    retentionPolicyId:
      typeof data.retentionPolicyId === "string" ? data.retentionPolicyId : undefined,
    status: isFileStatus(data.status) ? data.status : "active",
    source: typeof data.source === "string" ? data.source : undefined,
    detail: typeof data.detail === "string" ? data.detail : undefined,
    href: typeof data.href === "string" ? data.href : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
    deletedAtISO: typeof data.deletedAtISO === "string" ? data.deletedAtISO : undefined,
  };
}

function isFileVersionStatus(value: unknown): value is FileVersion["status"] {
  return value === "pending" || value === "stored" || value === "active" || value === "superseded";
}

function toFileVersionEntity(versionId: string, data: FirestoreFileVersionDocument): FileVersion {
  return {
    id: versionId,
    fileId: typeof data.fileId === "string" ? data.fileId : "",
    versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 0,
    status: isFileVersionStatus(data.status) ? data.status : "pending",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    checksum: typeof data.checksum === "string" ? data.checksum : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseFileRepository implements FileRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, FILE_COLLECTION);
  }

  async findById(fileId: string): Promise<File | null> {
    const normalizedFileId = fileId.trim();
    if (!normalizedFileId) {
      return null;
    }

    const snapshot = await getDoc(doc(this.db, FILE_COLLECTION, normalizedFileId));
    if (!snapshot.exists()) {
      return null;
    }

    return toFileEntity(snapshot.id, snapshot.data() as FirestoreFileDocument);
  }

  async findVersion(fileId: string, versionId: string): Promise<FileVersion | null> {
    const normalizedFileId = fileId.trim();
    const normalizedVersionId = versionId.trim();
    if (!normalizedFileId || !normalizedVersionId) {
      return null;
    }

    const snapshot = await getDoc(
      doc(this.db, FILE_COLLECTION, normalizedFileId, VERSION_SUBCOLLECTION, normalizedVersionId),
    );
    if (!snapshot.exists()) {
      return null;
    }

    return toFileVersionEntity(snapshot.id, snapshot.data() as FirestoreFileVersionDocument);
  }

  async listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    if (!workspaceId) {
      return [];
    }

    const snapshots = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        where("organizationId", "==", organizationId),
      ),
    );

    return snapshots.docs
      .map((snapshot) => toFileEntity(snapshot.id, snapshot.data() as FirestoreFileDocument))
      .sort((left, right) => right.updatedAtISO.localeCompare(left.updatedAtISO));
  }

  async save(file: File, versions: readonly FileVersion[] = []): Promise<void> {
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

    versions.forEach((version) => {
      batch.set(doc(fileRef, VERSION_SUBCOLLECTION, version.id), {
        fileId: version.fileId,
        versionNumber: version.versionNumber,
        status: version.status,
        storagePath: version.storagePath,
        ...(version.checksum ? { checksum: version.checksum } : {}),
        createdAtISO: version.createdAtISO,
      });
    });

    await batch.commit();
  }
}
