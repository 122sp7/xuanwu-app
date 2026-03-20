"use client";

/**
 * Module: wiki page
 * Purpose: workspace wiki / pages hub stub.
 * Responsibilities: display workspace wiki navigation and page list.
 * Constraints: UI-only stub; real page persistence will be wired in a future iteration.
 */

import { BookOpen, FilePlus, Home, Lock, Share2 } from "lucide-react";

import { Button } from "@/ui/shadcn/ui/button";

export default function WikiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">Wiki</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <FilePlus className="size-4" />
          新增頁面
        </Button>
      </div>

      {/* Home pinned page */}
      <div className="rounded-lg border border-border/60 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Home className="size-4 shrink-0 text-primary" />
          <span>首頁</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          此工作區的 Wiki 主頁。點擊「新增頁面」開始建立知識庫。
        </p>
      </div>

      {/* Workspace pages */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          工作區
        </h2>
        <div className="rounded-lg border border-border/60 bg-card/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">目前尚無工作區頁面。</p>
        </div>
      </section>

      {/* Shared pages */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Share2 className="size-3" />
          共用
        </h2>
        <div className="rounded-lg border border-border/60 bg-card/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">目前尚無共用頁面。</p>
        </div>
      </section>

      {/* Private pages */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Lock className="size-3" />
          私人
        </h2>
        <div className="rounded-lg border border-border/60 bg-card/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">目前尚無私人頁面。</p>
        </div>
      </section>

      {/* Archived */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          封存
        </h2>
        <div className="rounded-lg border border-border/60 bg-card/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">目前尚無封存頁面。</p>
        </div>
      </section>
    </div>
  );
}
