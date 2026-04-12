"use client";

import { useParams } from "next/navigation";

import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api";

export default function AccountWorkspaceFeedPage() {
  const params = useParams<{ accountId: string; workspaceId: string }>();

  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  if (!accountId || !workspaceId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        請先選擇工作區
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">動態牆</h1>
      <WorkspaceFeedWorkspaceView
        accountId={accountId}
        workspaceId={workspaceId}
        workspaceName="工作區"
      />
    </div>
  );
}
