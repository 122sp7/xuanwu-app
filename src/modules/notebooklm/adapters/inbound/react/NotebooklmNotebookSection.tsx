"use client";

/**
 * NotebooklmNotebookSection — notebooklm.notebook tab — RAG notebook overview.
 */

import { Brain, BookOpen } from "lucide-react";

interface NotebooklmNotebookSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotebooklmNotebookSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: NotebooklmNotebookSectionProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">RAG Notebook</h2>
      </div>
      <div className="rounded-xl border border-border/40 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <p>
            Notebook 功能整合中。上傳來源文件後，AI 將依向量索引回答問題。
          </p>
        </div>
        <p className="mt-2 text-xs">
          使用「AI Chat」分頁開始 RAG 問答對話。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}
