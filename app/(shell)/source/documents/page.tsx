"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useWorkspaceContext } from "@/modules/workspace/api";

/**
 * /source/documents is now a redirect shim.
 * Canonical file management lives at /workspace/[id]?tab=Files.
 * If a workspaceId is available (via URL param or active workspace),
 * we redirect immediately; otherwise we show a picker placeholder.
 */
export default function SourceDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeWorkspaceId },
  } = useWorkspaceContext();

  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const targetWorkspaceId = requestedWorkspaceId || activeWorkspaceId || "";

  useEffect(() => {
    if (targetWorkspaceId) {
      router.replace(`/workspace/${encodeURIComponent(targetWorkspaceId)}?tab=Files`);
    }
  }, [router, targetWorkspaceId]);

  if (targetWorkspaceId) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        正在導向工作區檔案管理頁面…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Source</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文件</h1>
        <p className="text-sm text-muted-foreground">工作區來源文件管理（已整合至工作區 Files 頁簽）。</p>
      </header>
      <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
        請先從側邊欄選擇一個工作區，系統將自動導向至該工作區的檔案管理頁面（
        <code className="rounded bg-muted px-1">?tab=Files</code>
        ）。你也可以直接在網址帶入{" "}
        <code className="rounded bg-muted px-1">workspaceId</code> 參數。
      </p>
    </div>
  );
}
