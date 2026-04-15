import {
  createKnowledgeDraftFromSourceDocument,
  createTasksFromParsedSourceDocument,
  previewTaskCandidatesFromParsedSourceDocument,
  deleteSourceDocument,
  getParsedSourceDocumentState,
  getSourceFileVersions,
  getWorkspaceFiles,
  getWorkspaceRagDocuments,
  parseSourceDocument,
  reindexSourceDocument,
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
  readonly jsonGcsUri?: string;
  readonly pageCount?: number;
  readonly hasParsedJson: boolean;
}

export interface WorkspaceManagedFileVersionItem {
  readonly id: string;
  readonly versionNumber: number;
  readonly status: string;
  readonly storagePath: string;
  readonly createdAtISO: string;
}

export interface WorkspaceManagedFileActionResult {
  readonly success: boolean;
  readonly message: string;
  readonly href?: string;
}

export interface WorkspaceManagedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}

export interface WorkspaceManagedTaskPreviewResult extends WorkspaceManagedFileActionResult {
  readonly candidates: ReadonlyArray<WorkspaceManagedTaskCandidate>;
  readonly usedAiFallback?: boolean;
}

function toGsUri(storagePath: string): string {
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "xuanwu-i-00708880-4e2d8.firebasestorage.app";
  return `gs://${bucket}/${storagePath.trim().replace(/^\/+/, "")}`;
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
      hasParsedJson: false,
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
        hasParsedJson: false,
      })),
  ];

  const enriched = await Promise.all(
    merged.map(async (file) => {
      const parsedState = await getParsedSourceDocumentState(workspace.accountId, file.id);
      const hasParsedJson = Boolean(parsedState?.jsonGcsUri);
      const detail = hasParsedJson
        ? `${file.detail} · JSON 已就緒${parsedState?.pageCount ? `（${parsedState.pageCount} 頁）` : ""}`
        : file.detail;

      return {
        ...file,
        detail,
        jsonGcsUri: parsedState?.jsonGcsUri || undefined,
        pageCount: parsedState?.pageCount || undefined,
        hasParsedJson,
      } satisfies WorkspaceManagedFileItem;
    }),
  );

  return enriched.sort((left, right) => {
    const leftTime = left.updatedAtISO ? Date.parse(left.updatedAtISO) : 0;
    const rightTime = right.updatedAtISO ? Date.parse(right.updatedAtISO) : 0;
    return rightTime - leftTime;
  });
}

export async function uploadWorkspaceManagedFile(
  workspace: WorkspaceEntity,
  file: File,
  options?: { readonly relativePath?: string },
) {
  return uploadWorkspaceSourceFile({
    workspaceId: workspace.id,
    accountId: workspace.accountId,
    accountType: workspace.accountType,
    file,
    displayName: options?.relativePath,
  });
}

export async function getWorkspaceManagedFileVersions(
  documentId: string,
): Promise<WorkspaceManagedFileVersionItem[]> {
  const versions = await getSourceFileVersions(documentId);

  return versions.map((version) => ({
    id: version.id,
    versionNumber: version.versionNumber,
    status: version.status,
    storagePath: version.storagePath,
    createdAtISO: version.createdAtISO,
  }));
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

export async function runWorkspaceManagedFileOcr(
  workspace: WorkspaceEntity,
  file: WorkspaceManagedFileItem,
): Promise<WorkspaceManagedFileActionResult> {
  if (!file.storagePath) {
    return { success: false, message: "缺少原始檔案路徑，無法執行 OCR。" };
  }

  const result = await parseSourceDocument({
    accountId: workspace.accountId,
    workspaceId: workspace.id,
    sourceFileId: file.id,
    filename: file.name,
    gcsUri: toGsUri(file.storagePath),
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
  });

  return result.ok
    ? { success: true, message: "已送出 OCR 解析，完成後會產生對應 JSON。" }
    : { success: false, message: result.error.message };
}

export async function runWorkspaceManagedFileRagIndex(
  workspace: WorkspaceEntity,
  file: WorkspaceManagedFileItem,
): Promise<WorkspaceManagedFileActionResult> {
  if (!file.jsonGcsUri || !file.storagePath) {
    return { success: false, message: "尚未找到已解析 JSON，請先執行 OCR。" };
  }

  const result = await reindexSourceDocument({
    accountId: workspace.accountId,
    workspaceId: workspace.id,
    sourceFileId: file.id,
    filename: file.name,
    sourceGcsUri: toGsUri(file.storagePath),
    jsonGcsUri: file.jsonGcsUri,
    pageCount: file.pageCount ?? 0,
  });

  return result.ok
    ? { success: true, message: `RAG 索引已完成，建立 ${result.data.chunkCount} 個 chunks。` }
    : { success: false, message: result.error.message };
}

export async function createWorkspaceManagedKnowledgePage(
  workspace: WorkspaceEntity,
  file: WorkspaceManagedFileItem,
  createdByUserId: string,
): Promise<WorkspaceManagedFileActionResult> {
  if (!file.jsonGcsUri || !file.storagePath) {
    return { success: false, message: "尚未找到已解析 JSON，請先執行 OCR。" };
  }

  const result = await createKnowledgeDraftFromSourceDocument({
    accountId: workspace.accountId,
    workspaceId: workspace.id,
    createdByUserId,
    filename: file.name,
    sourceGcsUri: toGsUri(file.storagePath),
    jsonGcsUri: file.jsonGcsUri,
    pageCount: file.pageCount ?? 0,
  });

  return result.success
    ? {
      success: true,
      message: "Knowledge Page 已建立。",
      href: `/knowledge/pages/${result.aggregateId}`,
    }
    : { success: false, message: result.error.message };
}

export async function previewWorkspaceManagedTasks(
  workspace: WorkspaceEntity,
  file: WorkspaceManagedFileItem,
): Promise<WorkspaceManagedTaskPreviewResult> {
  if (!file.jsonGcsUri) {
    return {
      success: false,
      message: "尚未找到已解析 JSON，請先執行 OCR。",
      candidates: [],
    };
  }

  const result = await previewTaskCandidatesFromParsedSourceDocument({
    knowledgePageId: `${workspace.id}:${file.id}:preview`,
    jsonGcsUri: file.jsonGcsUri,
  });

  if (result.errorMessage) {
    return {
      success: false,
      message: result.errorMessage,
      candidates: [],
      usedAiFallback: result.usedAiFallback,
    };
  }

  return {
    success: true,
    message: result.candidates.length > 0
      ? `已找到 ${result.candidates.length} 項候選任務，請確認後建立。`
      : "已完成任務掃描，但未找到可建立的任務。",
    candidates: result.candidates,
    usedAiFallback: result.usedAiFallback,
  };
}

export async function createWorkspaceManagedTasks(
  workspace: WorkspaceEntity,
  file: WorkspaceManagedFileItem,
  createdByUserId: string,
  confirmedTasks?: ReadonlyArray<WorkspaceManagedTaskCandidate>,
): Promise<WorkspaceManagedFileActionResult> {
  if (!file.jsonGcsUri || !file.storagePath) {
    return { success: false, message: "尚未找到已解析 JSON，請先執行 OCR。" };
  }

  const result = await createTasksFromParsedSourceDocument({
    accountId: workspace.accountId,
    workspaceId: workspace.id,
    createdByUserId,
    filename: file.name,
    sourceGcsUri: toGsUri(file.storagePath),
    jsonGcsUri: file.jsonGcsUri,
    pageCount: file.pageCount ?? 0,
    confirmedTasks,
  });

  return result.success
    ? {
      success: true,
      message: confirmedTasks?.length
        ? `已建立 ${confirmedTasks.length} 項任務，可前往 Tasks 查看。`
        : "任務流程已建立，可前往 Tasks 查看。",
      href: `/${encodeURIComponent(workspace.accountId)}/${encodeURIComponent(workspace.id)}?tab=Tasks`,
    }
    : { success: false, message: result.error.message };
}
