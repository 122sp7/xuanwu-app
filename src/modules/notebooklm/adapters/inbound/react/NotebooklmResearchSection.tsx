"use client";

/**
 * NotebooklmResearchSection — notebooklm.research tab — deep research synthesis.
 */

import { Search } from "lucide-react";

interface NotebooklmResearchSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotebooklmResearchSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: NotebooklmResearchSectionProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Research</h2>
      </div>
      <div className="rounded-xl border border-border/40 p-4 text-sm text-muted-foreground">
        <p>深度研究合成功能開發中。</p>
        <p className="mt-2 text-xs">
          此功能將整合多個來源文件，透過 RAG pipeline 提供跨文件的深度分析與摘要。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}
