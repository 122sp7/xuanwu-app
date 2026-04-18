"use client";

/**
 * WorkspaceApprovalSection — workspace.approval tab — acceptance review queue.
 */

import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceApprovalSectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceApprovalSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceApprovalSectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">驗收</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          待驗收 0
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "待審核", count: 0, icon: <Clock className="size-3.5 text-amber-500" /> },
          { label: "已通過", count: 0, icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
          { label: "已退回", count: 0, icon: <XCircle className="size-3.5 text-destructive" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Approval queue — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">目前沒有待驗收項目</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          通過質檢的任務將進入驗收流程，由客戶或負責人確認交付成果。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          查看質檢通過項目
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
