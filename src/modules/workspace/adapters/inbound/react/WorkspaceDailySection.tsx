"use client";

/**
 * WorkspaceDailySection — workspace.daily tab.
 *
 * Daily standup skeleton:
 *   ① Date navigation bar
 *   ② Stats row (today / done / in-progress / blocked)
 *   ③ Standup blocks (昨日 · 今日 · 阻礙)
 *   ④ Today's task timeline (empty state with guide copy)
 *   ⑤ Focus board: High-priority items
 */

import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  ListChecks,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceDailySectionProps {
  workspaceId: string;
  accountId: string;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("zh-Hant-TW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addDays(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StandupBlock({
  icon,
  title,
  placeholder,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  placeholder: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{title}</span>
      </div>
      <div className="min-h-[60px] rounded-lg border border-dashed border-border/50 bg-muted/20 px-3 py-2.5">
        <p className="text-xs text-muted-foreground/60">{placeholder}</p>
      </div>
    </div>
  );
}

function FocusItem({
  label,
  priority,
}: {
  label: string;
  priority: "high" | "medium" | "low";
}) {
  const dotColor = {
    high: "bg-rose-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  }[priority];

  const badgeLabel = { high: "高", medium: "中", low: "低" }[priority];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/30 px-3 py-2.5">
      <span className={`size-2 shrink-0 rounded-full ${dotColor}`} />
      <span className="flex-1 min-w-0 text-sm truncate">{label}</span>
      <Badge variant="outline" className="shrink-0 text-xs">
        {badgeLabel}優先
      </Badge>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function WorkspaceDailySection({
  workspaceId: _workspaceId,
  accountId: _accountId,
}: WorkspaceDailySectionProps): React.ReactElement {
  const [activeDate, setActiveDate] = useState(() => new Date());
  const isTodayActive = isToday(activeDate);

  const dateLabel = formatDateLabel(activeDate);

  return (
    <div className="space-y-5">
      {/* ① Date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">每日</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveDate((d) => addDays(d, -1))}
            className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
            aria-label="前一天"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <Badge
            variant={isTodayActive ? "default" : "outline"}
            className="cursor-pointer select-none text-xs"
            onClick={() => setActiveDate(new Date())}
          >
            {isTodayActive ? "今天" : "回今天"}
          </Badge>
          <span className="hidden text-xs text-muted-foreground sm:inline">{dateLabel}</span>
          <button
            onClick={() => setActiveDate((d) => addDays(d, 1))}
            className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
            aria-label="下一天"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Date label for mobile */}
      <p className="text-xs text-muted-foreground sm:hidden">{dateLabel}</p>

      {/* ② Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "今日任務", value: "0", icon: <Circle className="size-3.5 text-muted-foreground" /> },
          { label: "已完成", value: "0", icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
          { label: "進行中", value: "0", icon: <Clock className="size-3.5 text-amber-500" /> },
          { label: "待處理", value: "0", icon: <AlertTriangle className="size-3.5 text-rose-500" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-xl border border-border/40 bg-card/60 px-2.5 py-2.5"
          >
            <div className="flex items-center gap-1">
              {stat.icon}
              <span className="text-xs text-muted-foreground leading-none">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ③ Standup blocks */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          每日站立會議
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <StandupBlock
            icon={<CheckCircle2 className="size-3.5 text-emerald-500" />}
            title="昨日完成"
            placeholder="記錄昨日完成的工作項目…"
            color="text-emerald-600"
          />
          <StandupBlock
            icon={<ListChecks className="size-3.5 text-primary" />}
            title="今日計畫"
            placeholder="今天要完成的事項…"
            color="text-primary"
          />
          <StandupBlock
            icon={<AlertTriangle className="size-3.5 text-rose-500" />}
            title="阻礙與問題"
            placeholder="需要協助或卡關的事項…"
            color="text-rose-600"
          />
        </div>
      </div>

      {/* ④ Today's task timeline */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            今日任務時間軸
          </p>
          <Button size="sm" variant="outline" disabled className="h-6 gap-1 px-2 text-xs">
            <Plus className="size-3" />
            新增任務
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {isTodayActive ? "今日尚無安排的任務" : "此日無任務記錄"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            從任務分頁建立並指定日期，任務將出現於此時間軸。
          </p>
        </div>
      </div>

      {/* ⑤ Focus board: high-priority items */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            焦點清單
          </p>
          <MessageSquare className="size-3.5 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <FocusItem label="（尚無高優先任務）" priority="high" />
          <FocusItem label="（尚無中優先任務）" priority="medium" />
          <FocusItem label="（尚無低優先任務）" priority="low" />
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}
