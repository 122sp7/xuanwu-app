"use client";

import { type RefObject } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};

export const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");
export { ACCEPTED_MIME };

export interface RagUploadPanelProps {
  readonly effectiveWorkspaceId: string;
  readonly activeAccountId: string;
  readonly uploading: boolean;
  readonly selectedFile: File | null;
  readonly dragging: boolean;
  readonly fileInputRef: RefObject<HTMLInputElement>;
  readonly onFileChange: (file: File | null) => void;
  readonly onUpload: () => void;
  readonly onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
  readonly onDragLeave: () => void;
  readonly onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  readonly onClearFile: () => void;
}

export function RagUploadPanel({
  effectiveWorkspaceId,
  activeAccountId,
  uploading,
  selectedFile,
  dragging,
  fileInputRef,
  onFileChange,
  onUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onClearFile,
}: RagUploadPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>
          {effectiveWorkspaceId
            ? `拖曳或選擇檔案上傳到目前 workspace scope：${effectiveWorkspaceId}`
            : "拖曳或選擇檔案上傳到 account scope；workspace 視角為選填。"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition ${
            dragging ? "border-primary/60 bg-primary/10" : "border-border/70 bg-muted/10 hover:border-primary/40"
          }`}
        >
          <FileUp className="size-7 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "點擊或拖曳上傳"}</p>
            <p className="text-xs text-muted-foreground">支援：{ACCEPTED_EXTS}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={Object.keys(ACCEPTED_MIME).join(",")}
            className="sr-only"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
        <div className="flex items-center gap-2">
          <Button onClick={onUpload} disabled={uploading || !selectedFile || !activeAccountId}>
            {uploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {uploading ? "上傳中..." : "上傳並啟動解析"}
          </Button>
          <Button
            variant="outline"
            onClick={onClearFile}
            disabled={uploading}
          >
            清除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
