"use client";

import { FileSearch, Loader2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";

type FileStatusFilter = "all" | "uploaded" | "processing" | "ready" | "failed" | "active";

interface WorkspaceFilesFilterPanelProps {
  readonly search: string;
  readonly filter: FileStatusFilter;
  readonly uploadMessage: string | null;
  readonly loadState: "loading" | "loaded" | "error";
  readonly empty: boolean;
  readonly onSearchChange: (value: string) => void;
  readonly onFilterChange: (value: FileStatusFilter) => void;
}

export function WorkspaceFilesFilterPanel({
  search,
  filter,
  uploadMessage,
  loadState,
  empty,
  onSearchChange,
  onFilterChange,
}: WorkspaceFilesFilterPanelProps) {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <FileSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="搜尋檔案名稱或類型" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "uploaded", "processing", "ready", "failed"] as const).map((value) => (
            <Button key={value} size="sm" variant={filter === value ? "default" : "outline"} onClick={() => onFilterChange(value)}>
              {value === "all" ? "全部" : value}
            </Button>
          ))}
        </div>
      </div>

      {uploadMessage ? (
        <p className="text-sm text-muted-foreground">{uploadMessage}</p>
      ) : (
        <p className="text-sm text-muted-foreground">資料夾匯入會保留相對路徑名稱，方便後續 OCR、知識整理與版本追蹤。</p>
      )}

      {loadState === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> 載入檔案中…
        </div>
      ) : null}

      {loadState === "error" ? <p className="text-sm text-destructive">無法載入檔案清單，請稍後再試。</p> : null}
      {loadState === "loaded" && empty ? (
        <div className="rounded-xl border border-dashed border-border/50 px-4 py-8 text-sm text-muted-foreground">
          目前沒有符合條件的檔案。你可以先上傳檔案，或改用其他篩選條件。
        </div>
      ) : null}
    </>
  );
}

export type { FileStatusFilter };
