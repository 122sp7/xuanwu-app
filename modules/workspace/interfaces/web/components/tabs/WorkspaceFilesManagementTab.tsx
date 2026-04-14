"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { WorkspaceFilesFilterPanel, type FileStatusFilter } from "./WorkspaceFilesFilterPanel";
import { WorkspaceFilesSummaryCard } from "./WorkspaceFilesSummaryCard";
import { WorkspaceManagedFileCard } from "./WorkspaceManagedFileCard";
import { FileProcessingDialog } from "@/modules/notebooklm/api/ui";
import {
  deleteWorkspaceManagedFile,
  getWorkspaceManagedFileVersions,
  getWorkspaceManagedFiles,
  renameWorkspaceManagedFile,
  uploadWorkspaceManagedFile,
  type WorkspaceManagedFileItem,
  type WorkspaceManagedFileVersionItem,
} from "@/modules/workspace/api/facade";
import { Card, CardContent } from "@ui-shadcn/ui/card";
import type { WorkspaceEntity } from "../../../../domain/aggregates/Workspace";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "xuanwu-i-00708880-4e2d8.firebasestorage.app";

interface ProcessingTarget {
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

type FileWithRelativePath = File & { readonly webkitRelativePath?: string };
function toGsUri(storagePath: string): string {
  const normalized = storagePath.trim().replace(/^\/+/, "");
  return `gs://${DEFAULT_BUCKET}/${normalized}`;
}

function formatFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"] as const;
  let value = sizeBytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function getStatusTone(status: string): "default" | "secondary" | "outline" {
  if (status === "ready") return "default";
  if (status === "processing" || status === "uploaded") return "secondary";
  return "outline";
}
export function WorkspaceFilesManagementTab({ workspace }: { readonly workspace: WorkspaceEntity }) {
  const [documents, setDocuments] = useState<readonly WorkspaceManagedFileItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FileStatusFilter>("all");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [busyDocId, setBusyDocId] = useState<string | null>(null);
  const [processingTarget, setProcessingTarget] = useState<ProcessingTarget | null>(null);
  const [expandedVersionIds, setExpandedVersionIds] = useState<Record<string, boolean>>({});
  const [versionsByDocumentId, setVersionsByDocumentId] = useState<Record<string, readonly WorkspaceManagedFileVersionItem[]>>({});
  const [versionStateByDocumentId, setVersionStateByDocumentId] = useState<Record<string, "idle" | "loading" | "loaded" | "error">>({});
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const reloadLibrary = useCallback(async () => {
    setLoadState("loading");
    try {
      const nextDocuments = await getWorkspaceManagedFiles(workspace);
      setDocuments(nextDocuments);
      setLoadState("loaded");
    } catch {
      setDocuments([]);
      setLoadState("error");
    }
  }, [workspace]);

  useEffect(() => { void reloadLibrary(); }, [reloadLibrary]);

  useEffect(() => {
    if (!folderInputRef.current) return;
    folderInputRef.current.setAttribute("webkitdirectory", "");
    folderInputRef.current.setAttribute("directory", "");
  }, []);

  const filteredDocuments = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesFilter = filter === "all" ? true : doc.status === filter;
      const matchesSearch = !keyword
        || doc.name.toLowerCase().includes(keyword)
        || (doc.sourceFileName?.toLowerCase().includes(keyword) ?? false)
        || doc.mimeType.toLowerCase().includes(keyword);
      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);
  const managedFileCount = useMemo(() => documents.length, [documents.length]);
  const readyCount = useMemo(() => documents.filter((doc) => doc.status === "ready").length, [documents]);
  const failedCount = useMemo(() => documents.filter((doc) => doc.status === "failed").length, [documents]);

  async function handleUploadFiles(files: readonly File[], sourceLabel: "file" | "folder") {
    if (files.length === 0) return;

    setUploading(true);
    setUploadMessage(null);
    let successCount = 0;
    let failureCount = 0;
    let singleProcessingTarget: ProcessingTarget | null = null;

    for (const rawFile of files) {
      const file = rawFile as FileWithRelativePath;
      const relativePath = file.webkitRelativePath?.trim() || undefined;
      try {
        const result = await uploadWorkspaceManagedFile(workspace, file, {
          relativePath: sourceLabel === "folder" ? relativePath : undefined,
        });

        if (!result.success || !result.sourceFileId || !result.gcsUri || !result.filename) {
          failureCount += 1;
          continue;
        }

        successCount += 1;
        if (sourceLabel === "file" && files.length === 1) {
          singleProcessingTarget = {
            sourceFileId: result.sourceFileId,
            filename: result.filename,
            gcsUri: result.gcsUri,
            mimeType: result.mimeType ?? "application/octet-stream",
            sizeBytes: result.sizeBytes ?? 0,
          };
        }
      } catch {
        failureCount += 1;
      }
    }

    if (successCount > 0) {
      setUploadMessage(
        sourceLabel === "folder"
          ? `已匯入 ${successCount} 個資料夾檔案${failureCount > 0 ? `，另有 ${failureCount} 個失敗` : ""}。`
          : `已上傳 ${successCount} 個檔案${failureCount > 0 ? `，另有 ${failureCount} 個失敗` : ""}。`,
      );
    } else {
      setUploadMessage(sourceLabel === "folder" ? "資料夾匯入失敗" : "檔案上傳失敗");
    }

    if (singleProcessingTarget) {
      setProcessingTarget(singleProcessingTarget);
    }
    await reloadLibrary();
    setUploading(false);
  }

  async function toggleVersionHistory(documentId: string) {
    const isExpanded = expandedVersionIds[documentId] ?? false;
    if (isExpanded) {
      setExpandedVersionIds((current) => ({ ...current, [documentId]: false }));
      return;
    }

    setExpandedVersionIds((current) => ({ ...current, [documentId]: true }));

    if (versionStateByDocumentId[documentId] === "loaded") {
      return;
    }

    setVersionStateByDocumentId((current) => ({ ...current, [documentId]: "loading" }));

    try {
      const versions = await getWorkspaceManagedFileVersions(documentId);
      setVersionsByDocumentId((current) => ({ ...current, [documentId]: versions }));
      setVersionStateByDocumentId((current) => ({ ...current, [documentId]: "loaded" }));
    } catch {
      setVersionStateByDocumentId((current) => ({ ...current, [documentId]: "error" }));
    }
  }
  async function handleDeleteDocument(doc: WorkspaceManagedFileItem) {
    const confirmed = window.confirm(`確定要刪除 ${doc.name} 嗎？`);
    if (!confirmed) return;
    setBusyDocId(doc.id);
    try {
      const result = await deleteWorkspaceManagedFile(workspace, doc.id);
      if (!result.ok) {
        setUploadMessage(result.error.message);
        return;
      }
      setUploadMessage(`已刪除 ${doc.name}`);
      await reloadLibrary();
    } finally {
      setBusyDocId(null);
    }
  }

  async function handleRenameSave(doc: WorkspaceManagedFileItem) {
    if (!draftName.trim()) return;
    setBusyDocId(doc.id);
    try {
      const result = await renameWorkspaceManagedFile(workspace, doc.id, draftName.trim());
      if (!result.ok) {
        setUploadMessage(result.error.message);
        return;
      }
      setEditingDocId(null);
      setDraftName("");
      setUploadMessage(`已重新命名為 ${draftName.trim()}`);
      await reloadLibrary();
    } finally {
      setBusyDocId(null);
    }
  }

  return (
    <div className="space-y-4">
      <WorkspaceFilesSummaryCard
        uploading={uploading}
        managedFileCount={managedFileCount}
        readyCount={readyCount}
        failedCount={failedCount}
        folderInputRef={folderInputRef}
        onRefresh={() => void reloadLibrary()}
        onFilesSelected={(files) => void handleUploadFiles(files, "file")}
        onFolderSelected={(files) => void handleUploadFiles(files, "folder")}
      />

      <Card className="border border-border/50">
        <CardContent className="space-y-4 px-6 py-5">
          <WorkspaceFilesFilterPanel
            search={search}
            filter={filter}
            uploadMessage={uploadMessage}
            loadState={loadState}
            empty={filteredDocuments.length === 0}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
          />
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <WorkspaceManagedFileCard
                key={doc.id}
                doc={doc}
                isEditing={editingDocId === doc.id}
                draftName={draftName}
                isBusy={busyDocId === doc.id}
                isVersionExpanded={expandedVersionIds[doc.id] ?? false}
                versionLoadState={versionStateByDocumentId[doc.id]}
                versions={versionsByDocumentId[doc.id] ?? []}
                onDraftNameChange={setDraftName}
                onSave={() => void handleRenameSave(doc)}
                onCancelEdit={() => {
                  setEditingDocId(null);
                  setDraftName("");
                }}
                onStartEdit={() => {
                  setEditingDocId(doc.id);
                  setDraftName(doc.name);
                }}
                onOpenProcessing={() => {
                  if (!doc.storagePath) return;
                  setProcessingTarget({
                    sourceFileId: doc.id,
                    filename: doc.name || doc.sourceFileName || "Untitled file",
                    gcsUri: toGsUri(doc.storagePath),
                    mimeType: doc.mimeType,
                    sizeBytes: doc.sizeBytes,
                  });
                }}
                onToggleVersionHistory={() => void toggleVersionHistory(doc.id)}
                onDelete={() => void handleDeleteDocument(doc)}
                getStatusTone={getStatusTone}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {processingTarget ? (
        <FileProcessingDialog
          open
          onClose={() => setProcessingTarget(null)}
          accountId={workspace.accountId}
          workspaceId={workspace.id}
          sourceFileId={processingTarget.sourceFileId}
          filename={processingTarget.filename}
          gcsUri={processingTarget.gcsUri}
          mimeType={processingTarget.mimeType}
          sizeBytes={processingTarget.sizeBytes}
        />
      ) : null}
    </div>
  );
}
