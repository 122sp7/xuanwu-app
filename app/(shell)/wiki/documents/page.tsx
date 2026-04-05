"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { SourceDocumentsView } from "@/modules/source/api";

export default function WikiDocumentsPage() {
  const searchParams = useSearchParams();
  const {
    state: { workspaces, activeWorkspaceId },
  } = useApp();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const workspaceId =
    requestedWorkspaceId && Object.hasOwn(workspaces, requestedWorkspaceId)
      ? requestedWorkspaceId
      : activeWorkspaceId || undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文件</h1>
        <p className="text-sm text-muted-foreground">預設顯示帳號層級文件；可用 workspaceId 切換為工作區視角。</p>
      </header>

      <SourceDocumentsView workspaceId={workspaceId} />
    </div>
  );
}
