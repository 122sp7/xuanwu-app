"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { useWorkspaceContext } from "@/modules/workspace/api";
import { LibrariesView, LibraryTableView } from "@/modules/notebooklm/api";

export default function SourceLibrariesPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: wsState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = wsState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Source</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">資料庫</h1>
        <p className="text-sm text-muted-foreground">
          對齊資料庫／資料來源能力的 MVP，產品命名統一為 Libraries。
        </p>
      </header>

      {accountId ? (
        <>
          <LibraryTableView accountId={accountId} workspaceId={workspaceId} />
          <LibrariesView accountId={accountId} workspaceId={workspaceId} />
        </>
      ) : (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號情境，請先登入或切換帳號。
        </p>
      )}
    </div>
  );
}
