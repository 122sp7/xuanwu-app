"use client";

import { WikiBetaOverviewView } from "@/modules/wiki-beta";

export default function WikiBetaPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Account Wiki-Beta</h1>
        <p className="text-sm text-muted-foreground">入口頁面，聚焦帳號層級知識流程、工作區脈絡與快速進入各子功能。</p>
      </header>

      <WikiBetaOverviewView />
    </div>
  );
}
