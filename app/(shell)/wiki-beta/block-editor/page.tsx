"use client";

import { BlockEditorView } from "@/modules/wiki-beta";

export default function WikiBetaBlockEditorPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki-Beta</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">區塊編輯器</h1>
        <p className="text-sm text-muted-foreground">
          Notion-like 區塊編輯器。按下 Enter 新增區塊，輸入 <kbd className="rounded bg-muted px-1 text-[10px]">/</kbd> 呼叫指令選單。
        </p>
      </header>

      <div className="rounded-xl border border-border/60 bg-card">
        <BlockEditorView pageId="demo-page" />
      </div>
    </div>
  );
}
