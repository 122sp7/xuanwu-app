"use client";

import { DispatcherView } from "@/modules/schedule/interfaces/components/DispatcherView";

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

      <div className="min-h-0 flex-1">
        <DispatcherView />
      </div>
    </div>
  );
}
