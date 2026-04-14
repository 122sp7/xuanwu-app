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
  const assetByName = new Map(assets.map((asset) => [asset.name.trim().toLowerCase(), asset]));

  const mergedDocuments = documents.map((document) => {
    const matchedAsset = document.sourceFileId
      ? assetById.get(document.sourceFileId)
      : assetByName.get((document.sourceFileName || document.displayName).trim().toLowerCase());

    const effectiveId = document.sourceFileId || matchedAsset?.id || document.id;

    return {
      id: effectiveId,
      name: document.displayName || document.sourceFileName,
      workspaceId: document.workspaceId,
      organizationId: document.organizationId,
      mimeType: document.mimeType || "application/octet-stream",
      sizeBytes: document.sizeBytes,
      status: document.status,
      detail: matchedAsset?.detail || document.statusMessage || document.sourceFileName,
      href: matchedAsset?.href,
      storagePath: document.storagePath,
      sourceFileName: document.sourceFileName,
      updatedAtISO: document.updatedAtISO,
    };
  });

  const documentIds = new Set(mergedDocuments.map((document) => document.id));

  const merged = [
    ...mergedDocuments,
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
