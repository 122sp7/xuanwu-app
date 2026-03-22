"use client";

import { useRouter } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { WikiBetaLibrariesView } from "@/modules/wiki-beta";

export default function WikiBetaLibrariesPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Libraries</h1>
        <p className="text-sm text-muted-foreground">
          Notion Database/Data Source 對齊能力的 MVP，產品命名統一為 Libraries。
        </p>
      </header>

      <button
        type="button"
        onClick={() => router.push("/wiki-beta")}
        className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
      >
        返回 Wiki Beta
      </button>

      {accountId ? (
        <WikiBetaLibrariesView accountId={accountId} workspaceId={workspaceId} />
      ) : (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得 account context，請先登入或切換 account。
        </p>
      )}
    </div>
  );
}
