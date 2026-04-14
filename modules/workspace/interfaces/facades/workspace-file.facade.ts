import {
  deleteSourceDocument,
  getWorkspaceFiles,
  getWorkspaceRagDocuments,
  renameSourceDocument,
  uploadWorkspaceSourceFile,
} from "@/modules/notebooklm/api";

import type { WorkspaceEntity } from "../contracts";

export interface WorkspaceManagedFileItem {
  readonly id: string;
  readonly name: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: string;
  readonly detail: string;
  readonly href?: string;
  readonly storagePath?: string;
  readonly sourceFileName?: string;
  readonly updatedAtISO?: string;
}

export async function getWorkspaceManagedFiles(
  workspace: WorkspaceEntity,
): Promise<WorkspaceManagedFileItem[]> {
  const [assets, documents] = await Promise.all([
    getWorkspaceFiles(workspace),
    getWorkspaceRagDocuments(workspace),
  ]);

  const assetById = new Map(assets.map((asset) => [asset.id, asset]));
  const documentIds = new Set(documents.map((document) => document.id));

  const merged = [
    ...documents.map((document) => ({
      id: document.id,
      name: document.displayName || document.sourceFileName,
      workspaceId: document.workspaceId,
      organizationId: document.organizationId,
      mimeType: document.mimeType || "application/octet-stream",
      sizeBytes: document.sizeBytes,
      status: document.status,
      detail: assetById.get(document.id)?.detail || document.statusMessage || document.sourceFileName,
      href: assetById.get(document.id)?.href,
      storagePath: document.storagePath,
      sourceFileName: document.sourceFileName,
      updatedAtISO: document.updatedAtISO,
    })),
    ...assets
      .filter((asset) => !documentIds.has(asset.id))
      .map((asset) => ({
        id: asset.id,
        name: asset.name,
        workspaceId: asset.workspaceId,
        organizationId: asset.organizationId,
        mimeType: "application/octet-stream",
        sizeBytes: 0,
        status: asset.status,
        detail: asset.detail,
        href: asset.href,
        updatedAtISO: undefined,
      })),
  ];

  return merged.sort((left, right) => {
    const leftTime = left.updatedAtISO ? Date.parse(left.updatedAtISO) : 0;
    const rightTime = right.updatedAtISO ? Date.parse(right.updatedAtISO) : 0;
    return rightTime - leftTime;
  });
}

export async function uploadWorkspaceManagedFile(
  workspace: WorkspaceEntity,
  file: File,
) {
  return uploadWorkspaceSourceFile({
    workspaceId: workspace.id,
    accountId: workspace.accountId,
    accountType: workspace.accountType,
    file,
  });
}

export async function renameWorkspaceManagedFile(
  workspace: WorkspaceEntity,
  documentId: string,
  newName: string,
) {
  return renameSourceDocument(workspace.accountId, documentId, newName);
}

export async function deleteWorkspaceManagedFile(
  workspace: WorkspaceEntity,
  documentId: string,
) {
  return deleteSourceDocument(workspace.accountId, documentId);
}
