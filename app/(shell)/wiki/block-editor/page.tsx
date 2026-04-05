"use client";

import { BlockEditorView } from "@/modules/knowledge/api";

export default function WikiBlockEditorPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account Wiki</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">區塊編輯器</h1>
        <p className="text-sm text-muted-foreground">
          極簡 Zustand 狀態管理。Enter 新增區塊，Backspace 刪除空白區塊，拖曳重排。
        </p>
      </header>

      <BlockEditorView />
    </div>
  );
}
