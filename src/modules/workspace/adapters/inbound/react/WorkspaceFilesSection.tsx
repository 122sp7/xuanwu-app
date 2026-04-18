"use client";

/**
 * WorkspaceFilesSection — workspace.files tab — file management.
 */

import { FolderOpen, Upload, Grid2x2, List } from "lucide-react";
import { useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceFilesSectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceFilesSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceFilesSectionProps): React.ReactElement {
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">檔案</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            <List className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <Grid2x2 className="size-3.5" />
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Upload className="size-3.5" />
            上傳
          </Button>
        </div>
      </div>

      {/* Storage summary */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "全部", count: 0 },
          { label: "文件", count: 0 },
          { label: "圖片", count: 0 },
          { label: "其他", count: 0 },
        ].map((cat) => (
          <Badge key={cat.label} variant="outline" className="text-xs">
            {cat.label} ({cat.count})
          </Badge>
        ))}
      </div>

      {/* Files — empty state */}
      <div className="rounded-xl border border-dashed border-border/60 bg-card/20 px-4 py-10 text-center">
        <FolderOpen className="mx-auto mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無檔案</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          拖曳或點擊「上傳」按鈕將檔案新增至此工作區。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          <Upload className="size-3.5" />
          上傳檔案
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
