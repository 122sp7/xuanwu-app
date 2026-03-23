"use client";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { WikiBetaPagesView, WikiBetaShell } from "@/modules/wiki-beta";

export default function WikiBetaPagesPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? undefined;

  return (
    <WikiBetaShell>
      {accountId ? (
        <WikiBetaPagesView accountId={accountId} workspaceId={workspaceId} />
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            尚未取得 account context，請先登入或切換 account。
          </p>
        </div>
      )}
    </WikiBetaShell>
  );
}