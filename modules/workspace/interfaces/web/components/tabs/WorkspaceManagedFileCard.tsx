"use client";

import Link from "next/link";
import { Pencil, Trash2, Wand2 } from "lucide-react";

import type {
  WorkspaceManagedFileItem,
  WorkspaceManagedFileVersionItem,
} from "@/modules/workspace/api/facade";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";

import { WorkspaceFileVersionHistory } from "./WorkspaceFileVersionHistory";

interface WorkspaceManagedFileCardProps {
  readonly doc: WorkspaceManagedFileItem;
  readonly isEditing: boolean;
  readonly draftName: string;
  readonly isBusy: boolean;
  readonly isVersionExpanded: boolean;
  readonly versionLoadState?: "idle" | "loading" | "loaded" | "error";
  readonly versions: readonly WorkspaceManagedFileVersionItem[];
  readonly onDraftNameChange: (value: string) => void;
  readonly onSave: () => void;
  readonly onCancelEdit: () => void;
  readonly onStartEdit: () => void;
  readonly onOpenProcessing: () => void;
  readonly onToggleVersionHistory: () => void;
  readonly onDelete: () => void;
  readonly getStatusTone: (status: string) => "default" | "secondary" | "outline";
  readonly formatFileSize: (sizeBytes: number) => string;
}

export function WorkspaceManagedFileCard({
  doc,
  isEditing,
  draftName,
  isBusy,
  isVersionExpanded,
  versionLoadState,
  versions,
  onDraftNameChange,
  onSave,
  onCancelEdit,
  onStartEdit,
  onOpenProcessing,
  onToggleVersionHistory,
  onDelete,
  getStatusTone,
  formatFileSize,
}: WorkspaceManagedFileCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/70 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {isEditing ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={draftName} onChange={(event) => onDraftNameChange(event.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" onClick={onSave} disabled={isBusy}>儲存</Button>
                <Button size="sm" variant="outline" onClick={onCancelEdit}>取消</Button>
              </div>
            </div>
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">{doc.name}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusTone(doc.status)}>{doc.status}</Badge>
            <Badge variant="outline">{doc.mimeType || "file"}</Badge>
            <Badge variant="secondary">{formatFileSize(doc.sizeBytes)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{doc.detail}</p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button size="sm" variant="outline" disabled={!doc.storagePath} onClick={onOpenProcessing}>
            <Wand2 className="mr-1.5 h-4 w-4" />
            OCR / 後續處理
          </Button>
          {doc.href ? (
            <Button asChild size="sm" variant="outline">
              <Link href={doc.href}>開啟檔案</Link>
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={onToggleVersionHistory}>版本歷史</Button>
          <Button size="sm" variant="outline" onClick={onStartEdit}>
            <Pencil className="mr-1.5 h-4 w-4" />
            重新命名
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} disabled={isBusy}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            刪除
          </Button>
        </div>
      </div>

      {isVersionExpanded ? (
        <WorkspaceFileVersionHistory
          loadState={versionLoadState}
          versions={versions}
          getStatusTone={getStatusTone}
        />
      ) : null}
    </div>
  );
}
