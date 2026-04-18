"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Calculator, Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Separator } from "@ui-shadcn/ui/separator";

interface WorkspaceSettlementSectionProps { workspaceId: string; accountId: string }
type Stage = "草稿" | "送出" | "審查" | "通過";
type Item = { id: string; taskName: string; acceptedAt: string; stage: Stage; unitPrice: number; totalUnits: number; paidUnits: number };

const STAGES: Stage[] = ["草稿", "送出", "審查", "通過"];
const STAGE_BADGE: Record<Stage, "default" | "secondary" | "destructive" | "outline"> = {
  草稿: "outline",
  送出: "secondary",
  審查: "secondary",
  通過: "default",
};

export function WorkspaceSettlementSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceSettlementSectionProps): React.ReactElement {
  const items = useMemo<Item[]>(
    () => [
      { id: "s1", taskName: "首頁改版驗收", acceptedAt: "2026-04-14", stage: "通過", unitPrice: 10000, totalUnits: 3, paidUnits: 1 },
      { id: "s2", taskName: "會員流程驗收", acceptedAt: "2026-04-15", stage: "審查", unitPrice: 8000, totalUnits: 2, paidUnits: 0 },
      { id: "s3", taskName: "報表匯出驗收", acceptedAt: "2026-04-16", stage: "草稿", unitPrice: 12000, totalUnits: 2, paidUnits: 1 },
    ],
    [],
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [units, setUnits] = useState<Record<string, number>>({});
  const selectedItems = items.filter((item) => selected[item.id]);
  const payableCount = items.filter((item) => item.stage === "通過" && item.paidUnits < item.totalUnits).length;
  const total = useMemo(() => {
    const receivable = items.reduce((n, i) => n + i.unitPrice * i.totalUnits, 0);
    const received = items.reduce((n, i) => n + i.unitPrice * i.paidUnits, 0);
    return { receivable, received, pending: receivable - received };
  }, [items]);
  const requestAmount = selectedItems.reduce((n, item) => {
    const remaining = item.totalUnits - item.paidUnits;
    return n + Math.min(units[item.id] ?? remaining, remaining) * item.unitPrice;
  }, 0);
  const changeUnits = (item: Item, delta: number) => {
    const remaining = item.totalUnits - item.paidUnits;
    const current = units[item.id] ?? remaining;
    setUnits((prev) => ({ ...prev, [item.id]: Math.max(1, Math.min(remaining, current + delta)) }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Calculator className="size-4 text-primary" /><h2 className="text-sm font-semibold">結算</h2></div>
        <Badge variant="outline" className="text-xs">可請款 {payableCount} 筆</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "應收金額", amount: total.receivable, icon: <TrendingUp className="size-4 text-emerald-500" />, sub: `${items.length} 筆驗收項目` },
          { label: "已收款", amount: total.received, icon: <BadgeCheck className="size-4 text-primary" />, sub: "可分次收付款" },
          { label: "待結算", amount: total.pending, icon: <TrendingDown className="size-4 text-amber-500" />, sub: `本次預計 NT$ ${requestAmount.toLocaleString()}` },
        ].map((card) => (
          <div key={card.label} className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card/60 px-4 py-4">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{card.label}</p>{card.icon}</div>
            <p className="text-lg font-semibold">NT$ {card.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/40 bg-card/30 px-3 py-3">
        <p className="text-xs text-muted-foreground">流程</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {STAGES.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <Badge variant={STAGE_BADGE[stage]} className="text-xs">{stage}</Badge>
              {index < STAGES.length - 1 ? <span className="text-xs text-muted-foreground">{">"}</span> : null}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        {items.map((item) => {
          const remaining = item.totalUnits - item.paidUnits;
          const selectedUnits = units[item.id] ?? remaining;
          const selectable = item.stage === "通過" && remaining > 0;
          return (
            <div key={item.id} className="space-y-3 rounded-xl border border-border/40 bg-card/30 px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1"><p className="text-sm font-medium">{item.taskName}</p><p className="text-xs text-muted-foreground">驗收完成日 {item.acceptedAt}</p></div>
                <Badge variant={STAGE_BADGE[item.stage]} className="text-xs">{item.stage}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>單價 NT$ {item.unitPrice.toLocaleString()}</span><span>已收 {item.paidUnits}/{item.totalUnits} 次</span><span>剩餘 {remaining} 次</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox checked={Boolean(selected[item.id])} disabled={!selectable} onCheckedChange={(checked) => setSelected((prev) => ({ ...prev, [item.id]: Boolean(checked) }))} />
                  多選可請款
                </label>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="size-8" disabled={!selectable || !selected[item.id]} onClick={() => changeUnits(item, -1)}><Minus className="size-3.5" /></Button>
                  <span className="min-w-10 text-center text-sm font-medium">{selectedUnits}</span>
                  <Button size="icon" variant="outline" className="size-8" disabled={!selectable || !selected[item.id]} onClick={() => changeUnits(item, 1)}><Plus className="size-3.5" /></Button>
                </div>
                <p className="text-xs text-muted-foreground">本筆請款 NT$ {(selectedUnits * item.unitPrice).toLocaleString()}</p>
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-3">
          <p className="text-sm">已選 {selectedItems.length} 筆，合計 <span className="font-semibold">NT$ {requestAmount.toLocaleString()}</span></p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={selectedItems.length === 0}>儲存草稿</Button>
            <Button size="sm" variant="outline" disabled={selectedItems.length === 0}>送出請款</Button>
            <Button size="sm" disabled={selectedItems.length === 0}>記錄收款</Button>
          </div>
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}
