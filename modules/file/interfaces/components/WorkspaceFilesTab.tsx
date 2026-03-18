"use client";

import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { getWorkspaceFiles } from "../queries/file.queries";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceFilesTab({ workspace }: WorkspaceFilesTabProps) {
  const [assets, setAssets] = useState<WorkspaceFileListItemDto[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadFiles() {
      setLoadState("loading");

      try {
        const nextAssets = await getWorkspaceFiles(workspace);
        if (cancelled) {
          return;
        }

        setAssets(nextAssets);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceFilesTab] Failed to load file metadata:", error);
        }

        if (!cancelled) {
          setAssets([]);
          setLoadState("error");
        }
      }
    }

    void loadFiles();

    return () => {
      cancelled = true;
    };
  }, [workspace]);

  const availableCount = useMemo(
    () => assets.filter((asset) => asset.status === "active").length,
    [assets],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          盤點目前已註冊或可立即導出的工作區資產，作為後續檔案流程的起點。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                    <a
                      href={asset.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-primary hover:underline"
                    >
                      Open asset
                    </a>
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
