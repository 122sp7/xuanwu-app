"use client";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { PagesDnDView } from "@/modules/content/api";

export default function WikiPagesDnDPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">頁面樹拖曳</h1>
        <p className="text-sm text-muted-foreground">
          使用 @atlaskit/pragmatic-drag-and-drop 拖曳重組頁面層級。
        </p>
      </header>

      <PagesDnDView accountId={accountId} workspaceId={workspaceId} />
    </div>
  );
}
