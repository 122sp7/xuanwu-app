"use client";

/**
 * WorkspaceSettlementSection — workspace.settlement tab — invoice settlement.
 */

import { Calculator } from "lucide-react";

interface WorkspaceSettlementSectionProps { workspaceId: string; accountId: string }

export function WorkspaceSettlementSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceSettlementSectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">結算</h2>
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <Calculator className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無結算記錄</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          驗收完成的任務將自動產生請款項目，待確認後可在此進行結算。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}
