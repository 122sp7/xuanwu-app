"use client";

/**
 * WorkspaceOverviewSection — workspace.overview tab.
 *
 * Six-panel overview of a workspace:
 *   1. 基本工作區資訊  — workspace metadata
 *   2. 里程碑 · 甘特圖 · 進度表  — milestone / schedule timeline
 *   3. 人力與出勤  — staffing & attendance
 *   4. 成本與預算  — cost & budget
 *   5. 任務與問題  — tasks & issues summary
 *   6. 即時狀態   — live feed
 */

import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Flag,
  MapPin,
  Radio,
  Users,
} from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { type WorkspaceEntity } from "./WorkspaceContext";

interface WorkspaceOverviewSectionProps {
  workspaceId: string;
  accountId: string;
  workspace: WorkspaceEntity;
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/30">
      <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function StatPill({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-lg font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="py-6 text-center text-xs text-muted-foreground/70">{label}</p>
  );
}

// ── 1. 基本工作區資訊 ─────────────────────────────────────────────────────────

function BasicInfoPanel({ workspace }: { workspace: WorkspaceEntity }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "名稱", value: workspace.name },
    { label: "狀態", value: <Badge variant="outline">{workspace.lifecycleState}</Badge> },
    { label: "可見性", value: <Badge variant="secondary">{workspace.visibility}</Badge> },
    { label: "工作區 ID", value: <span className="font-mono text-xs">{workspace.id}</span> },
    { label: "地址", value: <span className="text-muted-foreground/80">—</span> },
    { label: "地點", value: (
      <span className="inline-flex items-center gap-1 text-muted-foreground/80">
        <MapPin className="size-3" />
        —
      </span>
    )},
    { label: "整體進度", value: (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-border/60">
          <div className="h-full w-0 rounded-full bg-primary" />
        </div>
        <span className="text-xs text-muted-foreground">0%</span>
      </div>
    )},
  ];

  return (
    <SectionCard
      icon={<Flag className="size-4 text-primary" />}
      title="基本工作區資訊"
    >
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}

// ── 2. 里程碑 · 甘特圖 · 進度表 ───────────────────────────────────────────────

function MilestonePanel() {
  const MILESTONE_STUBS = [
    { label: "規劃完成", date: "—", done: false },
    { label: "設計確認", date: "—", done: false },
    { label: "開發交付", date: "—", done: false },
    { label: "驗收結案", date: "—", done: false },
  ];

  return (
    <SectionCard
      icon={<CalendarRange className="size-4 text-primary" />}
      title="里程碑 · 甘特圖 · 進度表"
    >
      <div className="space-y-2">
        {MILESTONE_STUBS.map((m, i) => (
          <div
            key={m.label}
            className="flex items-center gap-3 rounded-lg border border-border/30 px-3 py-2.5"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border/60 text-xs text-muted-foreground">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">目標日期：{m.date}</p>
            </div>
            <Circle className="size-3.5 text-muted-foreground/40 shrink-0" />
          </div>
        ))}
        <EmptyState label="甘特圖與進度表將在建立任務後自動產生" />
      </div>
    </SectionCard>
  );
}

// ── 3. 人力與出勤 ─────────────────────────────────────────────────────────────

function StaffingPanel() {
  return (
    <SectionCard
      icon={<Users className="size-4 text-primary" />}
      title="人力與出勤"
    >
      <div className="grid grid-cols-3 gap-2">
        <StatPill label="成員數" value="0" />
        <StatPill label="今日出勤" value="0" color="text-emerald-600" />
        <StatPill label="請假中" value="0" color="text-amber-500" />
      </div>
      <EmptyState label="指派成員後出勤資料將顯示於此" />
    </SectionCard>
  );
}

// ── 4. 成本與預算 ─────────────────────────────────────────────────────────────

function BudgetPanel() {
  return (
    <SectionCard
      icon={<DollarSign className="size-4 text-primary" />}
      title="成本與預算"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatPill label="總預算" value="—" />
        <StatPill label="已使用" value="—" color="text-amber-600" />
        <StatPill label="剩餘" value="—" color="text-emerald-600" />
        <StatPill label="預算使用率" value="0%" />
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>預算使用進度</span>
          <span>0%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border/40">
          <div className="h-full w-0 rounded-full bg-primary/70 transition-all" />
        </div>
      </div>
      <EmptyState label="設定預算後，成本追蹤將顯示於此" />
    </SectionCard>
  );
}

// ── 5. 任務與問題 ─────────────────────────────────────────────────────────────

function TasksIssuesPanel() {
  return (
    <SectionCard
      icon={<BarChart3 className="size-4 text-primary" />}
      title="任務與問題"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatPill label="總任務" value="0" />
        <StatPill label="已完成" value="0" color="text-emerald-600" />
        <StatPill label="進行中" value="0" color="text-amber-500" />
        <StatPill label="逾期" value="0" color="text-rose-600" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/30 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="size-3.5 text-rose-500" />
            <span>開放問題單</span>
          </div>
          <p className="mt-1 text-lg font-semibold">0</p>
        </div>
        <div className="rounded-lg border border-border/30 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>已解決</span>
          </div>
          <p className="mt-1 text-lg font-semibold">0</p>
        </div>
      </div>
      <EmptyState label="建立任務後，看板與進度將顯示於此" />
    </SectionCard>
  );
}

// ── 6. 即時狀態 ───────────────────────────────────────────────────────────────

function LiveStatusPanel() {
  return (
    <SectionCard
      icon={<Radio className="size-4 text-primary" />}
      title="即時狀態"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          <div>
            <p className="text-xs text-muted-foreground">工作區狀態</p>
            <p className="text-sm font-medium">正常</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2.5">
          <Clock className="size-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">今日工時</p>
            <p className="text-sm font-medium">0h</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2.5">
          <Activity className="size-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">最新動態</p>
            <p className="text-sm font-medium">—</p>
          </div>
        </div>
      </div>
      <EmptyState label="工作區啟動後，即時狀態與活動記錄將顯示於此" />
    </SectionCard>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function WorkspaceOverviewSection({
  workspaceId: _workspaceId,
  accountId: _accountId,
  workspace,
}: WorkspaceOverviewSectionProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <BasicInfoPanel workspace={workspace} />
      <MilestonePanel />
      <div className="grid gap-4 md:grid-cols-2">
        <StaffingPanel />
        <BudgetPanel />
      </div>
      <TasksIssuesPanel />
      <LiveStatusPanel />
    </div>
  ) as React.ReactElement;
}
