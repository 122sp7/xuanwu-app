"use client";

import { Compass, Workflow } from "lucide-react";

/**
 * Dispatcher page — 今日跨工作區任務調度視圖。
 *
 * Route: /organization/schedule/dispatcher
 */
export default function DispatcherPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <header className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          組織排程
        </p>
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
          調度台
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          跨工作區任務需求 vs. 成員人力資源 · 今日調度視圖
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
          <Compass className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold text-foreground">調度台已暫停掛載</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            舊的 DispatcherView 來自已刪除的 schedule 領域，這個入口目前只保留 URL 與頁面骨架。
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
          <Workflow className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold text-foreground">重建方向</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            後續可先從組織待分派請求清單與單日 dispatch 面板開始，避免一次重建完整排程引擎。
          </p>
        </div>
      </section>
    </div>
  );
}
