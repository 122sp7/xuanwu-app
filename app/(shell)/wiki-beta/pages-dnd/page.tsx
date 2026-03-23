"use client";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { WikiBetaPagesDnDView } from "@/modules/wiki-beta";

export default function WikiBetaPagesDnDPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">頁面樹（拖曳重排）</h1>
        <p className="text-sm text-muted-foreground">
          使用 @atlaskit/pragmatic-drag-and-drop 拖曳重排頁面。拖動左側控點調整順序。
        </p>
      </header>

      <WikiBetaPagesDnDView accountId={accountId} workspaceId={workspaceId} />
    </div>
  );
}
