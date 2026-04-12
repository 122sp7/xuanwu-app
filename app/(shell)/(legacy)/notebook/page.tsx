"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";

export default function NotebookPage() {
  const router = useRouter();
  const {
    state: { activeAccount },
  } = useApp();
  const {
    state: { activeWorkspaceId },
  } = useWorkspaceContext();

  const accountId = activeAccount?.id ?? "";
  const workspaceId = activeWorkspaceId ?? "";

  useEffect(() => {
    if (!accountId || !workspaceId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/notebook/rag-query`,
    );
  }, [accountId, workspaceId, router]);

  if (!accountId || !workspaceId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        請先選擇工作區
      </div>
    );
  }

  return <div className="px-4 py-6 text-sm text-muted-foreground">正在導向 Notebook…</div>;
}
