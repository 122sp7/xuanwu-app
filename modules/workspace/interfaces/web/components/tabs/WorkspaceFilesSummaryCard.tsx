"use client";

import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

interface WorkspaceFilesSummaryCardProps {
  readonly uploading: boolean;
  readonly managedFileCount: number;
  readonly readyCount: number;
  readonly failedCount: number;
  readonly folderInputRef: React.RefObject<HTMLInputElement | null>;
  readonly onRefresh: () => void;
  readonly onFilesSelected: (files: readonly File[]) => void;
  readonly onFolderSelected: (files: readonly File[]) => void;
}

export function WorkspaceFilesSummaryCard({
  uploading,
  managedFileCount,
  readyCount,
  failedCount,
  folderInputRef,
  onRefresh,
  onFilesSelected,
  onFolderSelected,
}: WorkspaceFilesSummaryCardProps) {
  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Workspace Files</CardTitle>
            <CardDescription>
              以 workspace 為中心管理檔案資產，支援單檔上傳、資料夾匯入、OCR 後續處理與版本追蹤。
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              重新整理
            </Button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              <Plus className="mr-1.5 h-4 w-4" />
              {uploading ? "上傳中…" : "新增檔案"}
              <input
                type="file"
                multiple
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  if (files.length > 0) onFilesSelected(files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <Button variant="outline" disabled={uploading} onClick={() => folderInputRef.current?.click()}>
              {uploading ? "匯入中…" : "匯入資料夾"}
            </Button>
            <input
              ref={folderInputRef}
              type="file"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) onFolderSelected(files);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">All files</p>
          <p className="mt-1 text-2xl font-semibold">{managedFileCount}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Ready for reuse</p>
          <p className="mt-1 text-2xl font-semibold">{readyCount}</p>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Need attention</p>
          <p className="mt-1 text-2xl font-semibold">{failedCount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
