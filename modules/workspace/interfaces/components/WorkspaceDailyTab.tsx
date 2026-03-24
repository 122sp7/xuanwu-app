"use client";

/**
 * WorkspaceDailyTab — Daily 模組重建前的工作區佔位畫面。
 * 先切斷對已刪除 modules/daily 的依賴，保留入口與最小上下文。
 */

import { AlertCircle, Hammer } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import type { WorkspaceEntity } from "@/modules/workspace";

import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  const { state: appState } = useApp();
  const actor = appState.activeAccount;

  const actorName = actor?.name ?? "未知";
  const actorAvatar = "photoURL" in (actor ?? {}) ? (actor as { photoURL?: string }).photoURL : undefined;
  const actorInitial = actorName.charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card/50 p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={actorAvatar} alt={actorName} />
            <AvatarFallback className="text-sm font-bold">{actorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{workspace.name} Daily</p>
            <p className="text-xs text-muted-foreground">workspaceId: {workspace.id}</p>
          </div>
        </div>
        <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
          rebuilding
        </div>
      </header>

      <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Hammer className="h-4 w-4" />
          Workspace Daily 模組正在重建
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          目前先保留工作區入口與上下文，並移除對已刪除 modules/daily 的殘留依賴。後續可直接在這個殼層接回新的 X-like feed、composer 與互動模型。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">actor</p>
            <p className="mt-1 text-sm font-medium">{actorName}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">scope</p>
            <p className="mt-1 text-sm font-medium">account {workspace.accountId}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-muted/40 p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="h-4 w-4" />
          待重建項目
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. X-like workspace feed projection</li>
          <li>2. reply / repost / like / view / bookmark / share interaction model</li>
          <li>3. account-level aggregated daily feed</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button type="button" disabled>
          Daily composer will return here
        </Button>
      </div>
    </section>
  );
}
