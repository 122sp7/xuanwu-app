"use client";

/**
 * WorkspaceQualitySection — workspace.quality tab — quality review queue.
 */

import { Badge, Button } from "@packages";
import { ShieldCheck, ClipboardCheck, ClipboardX } from "lucide-react";

interface WorkspaceQualitySectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceQualitySection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceQualitySectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">質檢</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          待審核 0
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "待質檢", count: 0, icon: <ShieldCheck className="size-3.5 text-amber-500" /> },
          { label: "通過", count: 0, icon: <ClipboardCheck className="size-3.5 text-emerald-500" /> },
          { label: "未通過", count: 0, icon: <ClipboardX className="size-3.5 text-destructive" /> },
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

      {/* Review queue — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <ShieldCheck className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">目前沒有待質檢項目</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          任務完成後需通過質檢審核，才能進入驗收流程。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          查看任務
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
