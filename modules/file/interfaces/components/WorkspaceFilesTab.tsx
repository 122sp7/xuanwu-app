"use client";

import { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { getWorkspaceFiles } from "../queries/file.queries";
import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import { uploadCompleteFile, uploadInitFile } from "../_actions/file.actions";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import { Label } from "@/ui/shadcn/ui/label";
import { getFirebaseStorage } from "@/infrastructure/firebase";

interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceFilesTab({ workspace }: WorkspaceFilesTabProps) {
  const [assets, setAssets] = useState<WorkspaceFileListItemDto[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  async function reloadFiles() {
    setLoadState("loading");

    try {
      const nextAssets = await getWorkspaceFiles(workspace);
      setAssets(nextAssets);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[WorkspaceFilesTab] Failed to load file metadata:",
          error instanceof Error ? error.message : "unknown error",
        );
      }

      setAssets([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadFiles() {
      await reloadFiles();
      if (cancelled) {
        return;
      }
    }

    void loadFiles();

    return () => {
      cancelled = true;
    };
  }, [workspace]);

  async function handleUploadFile(file: File) {
    const organizationId = resolveFileOrganizationId(workspace.accountType, workspace.accountId);
    setUploadState("uploading");
    setUploadMessage(null);

    try {
      const initResult = await uploadInitFile({
        workspaceId: workspace.id,
        organizationId,
        actorAccountId: workspace.accountId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });

      if (!initResult.ok) {
        setUploadState("error");
        setUploadMessage(initResult.error.message);
        return;
      }

      const storage = getFirebaseStorage();
      const storageRef = ref(storage, initResult.data.uploadPath);
      await uploadBytes(storageRef, file, {
        contentType: file.type || "application/octet-stream",
      });
      const downloadHref = await getDownloadURL(storageRef);

      const completeResult = await uploadCompleteFile({
        workspaceId: workspace.id,
        organizationId,
        actorAccountId: workspace.accountId,
        fileId: initResult.data.fileId,
        versionId: initResult.data.versionId,
      });

      if (!completeResult.ok) {
        setUploadState("error");
        setUploadMessage(completeResult.error.message);
        return;
      }

      setUploadState("success");
      setUploadMessage(
        `Uploaded ${file.name}; document ${completeResult.data.ragDocumentId} is ${completeResult.data.ragDocumentStatus}.`,
      );

      setAssets((current) =>
        current.map((asset) =>
          asset.id === completeResult.data.fileId ? { ...asset, href: asset.href ?? downloadHref } : asset,
        ),
      );
      await reloadFiles();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFilesTab] Upload flow failed:", error);
      }
      setUploadState("error");
      setUploadMessage(error instanceof Error ? error.message : "Upload failed unexpectedly.");
    }
  }

  const availableCount = useMemo(
    () => assets.filter((asset) => asset.status === "active").length,
    [assets],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          盤點目前已註冊或可立即導出的工作區資產，並提供 upload → storage → firestore 的完整流程入口。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <Label htmlFor="workspace-file-upload" className="text-sm font-semibold text-foreground">
                Upload file
              </Label>
              <p className="text-xs text-muted-foreground">
                This triggers upload-init, uploads binary to Storage, then writes completion + RAG registration to Firestore.
              </p>
            </div>
            <Input
              id="workspace-file-upload"
              type="file"
              className="max-w-xs"
              disabled={uploadState === "uploading"}
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                if (!nextFile) {
                  return;
                }

                void handleUploadFile(nextFile);
                event.currentTarget.value = "";
              }}
            />
          </div>
          {uploadMessage && (
            <p
              className={`mt-3 text-xs ${
                uploadState === "error" ? "text-destructive" : "text-emerald-600"
              }`}
            >
              {uploadMessage}
            </p>
          )}
          {uploadState === "uploading" && (
            <p className="mt-3 text-xs text-muted-foreground">Uploading and persisting metadata…</p>
          )}
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading file metadata…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入已持久化的檔案資料，請稍後再試。
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Registered assets</p>
            <p className="mt-1 text-xl font-semibold">{assets.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Directly available</p>
            <p className="mt-1 text-xl font-semibold">{availableCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Derived manifests</p>
            <p className="mt-1 text-xl font-semibold">{assets.length - availableCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {loadState === "loaded" && assets.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/40 px-4 py-6 text-sm text-muted-foreground">
              尚未有持久化的檔案紀錄，後續 upload-init 流程會先在此建立 metadata。
            </div>
          )}

          {assets.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                    <Badge variant={asset.status === "active" ? "secondary" : "outline"}>
                      {asset.status}
                    </Badge>
                    <Badge variant="outline">{asset.kind}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{asset.detail}</p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>Source: {asset.source}</p>
                  {asset.href && (
                    <Button asChild variant="link" className="mt-1 inline-flex h-auto p-0 text-xs">
                      <a href={asset.href} target="_blank" rel="noreferrer">
                        Open asset
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
