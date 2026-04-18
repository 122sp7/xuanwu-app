"use client";

/**
 * WorkspaceSettlementSection — workspace.settlement tab — financial settlement summary.
 */

import { Calculator, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Separator } from "@ui-shadcn/ui/separator";

interface WorkspaceSettlementSectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceSettlementSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceSettlementSectionProps): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">結算</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          本期 0 筆
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "應收金額",
            amount: "NT$ 0",
            icon: <TrendingUp className="size-4 text-emerald-500" />,
            sub: "0 筆驗收通過",
          },
          {
            label: "已結算",
            amount: "NT$ 0",
            icon: <Minus className="size-4 text-muted-foreground" />,
            sub: "0 筆",
          },
          {
            label: "待結算",
            amount: "NT$ 0",
            icon: <TrendingDown className="size-4 text-amber-500" />,
            sub: "0 筆",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card/60 px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              {card.icon}
            </div>
            <p className="text-lg font-semibold">{card.amount}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Settlement list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <Calculator className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無結算記錄</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          驗收通過的任務確認交付金額後，將出現在此進行結算。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          查看驗收記錄
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
