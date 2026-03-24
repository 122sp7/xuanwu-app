"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  GanttChart,
  List,
  Users,
} from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { getWorkspaceSchedule, DispatcherView } from "@/modules/schedule";
import type { WorkspaceScheduleItem } from "@/modules/schedule";
import { listWorkspaceScheduleMdddFlowProjections } from "@/modules/schedule/interfaces/queries/schedule-mddd.queries";
import type { ScheduleMdddFlowProjection } from "@/modules/schedule/domain/mddd/value-objects/Projection";
import { Badge } from "@ui-shadcn/ui/badge";
import { isOrganizationAccount } from "../_utils";

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "list" | "calendar" | "dispatcher";
type StatusTab = "upcoming" | "unconfirmed" | "recurring" | "past" | "cancelled";

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: "upcoming", label: "即將到來" },
  { value: "unconfirmed", label: "未確認" },
  { value: "recurring", label: "定期" },
  { value: "past", label: "之前" },
  { value: "cancelled", label: "已取消" },
];

const ITEM_TYPE_LABEL: Record<"milestone" | "follow-up" | "maintenance", string> = {
  milestone: "里程碑",
  "follow-up": "跟進",
  maintenance: "維護",
};

const DAYS_ZH = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface BookingRow {
  readonly workspaceId: string;
  readonly workspaceName: string;
  readonly item: WorkspaceScheduleItem;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekSunday(offsetWeeks: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + offsetWeeks * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(sunday: Date): string {
  const saturday = new Date(sunday);
  saturday.setDate(saturday.getDate() + 6);
  const start = sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${start} - ${saturday.getDate()}, ${saturday.getFullYear()}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeOrganizationId = isOrganizationAccount(activeAccount)
    ? activeAccount.id
    : null;

  const viewMode: ViewMode =
    searchParams.get("view") === "calendar"
      ? "calendar"
      : searchParams.get("view") === "dispatcher"
        ? "dispatcher"
        : "list";

  const activeTab: StatusTab =
    (searchParams.get("status") as StatusTab | null) ?? "upcoming";

  // ── Data state ──────────────────────────────────────────────────────────────
  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [bookingRows, setBookingRows] = useState<readonly BookingRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  // Cross-workspace MDDD flow projections (待分派 view)
  const [allProjections, setAllProjections] = useState<readonly (ScheduleMdddFlowProjection & { workspaceName: string })[]>([]);

  // ── Calendar week navigation ─────────────────────────────────────────────
  const [weekOffset, setWeekOffset] = useState(0);

  const weekSunday = useMemo(() => getWeekSunday(weekOffset), [weekOffset]);
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekSunday);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [weekSunday],
  );
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ── Current-time indicator (minutes since midnight, refreshed every minute) ─
  const [nowMinutes, setNowMinutes] = useState<number>(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const refresh = () => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    };
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch workspaces ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;
    getWorkspacesForAccount(activeOrganizationId)
      .then((data) => {
        if (!cancelled) setWorkspaces(data);
      })
      .catch(() => {
        if (!cancelled) setWorkspaces([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  // ── Aggregate upcoming bookings ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // All setState calls are inside async callbacks to satisfy the lint rule
    Promise.resolve(workspaces)
      .then((ws) => {
        if (cancelled) return;
        if (ws.length === 0) {
          setBookingRows([]);
          setLoadState("loaded");
          return;
        }
        setLoadState("loading");
        return Promise.all(
          ws.map(async (w) => {
            try {
              const items = await getWorkspaceSchedule(w.id);
              return items
                .filter((item) => item.status === "upcoming")
                .map((item): BookingRow => ({
                  workspaceId: w.id,
                  workspaceName: w.name,
                  item,
                }));
            } catch {
              return [] as BookingRow[];
            }
          }),
        ).then((results) => {
          if (!cancelled) {
            setBookingRows(results.flat());
            setLoadState("loaded");
          }
        });
      })
      .catch(() => {
        if (!cancelled) {
          setBookingRows([]);
          setLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workspaces]);

  // ── Aggregate MDDD projections across all workspaces ─────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      workspaces.map(async (w) => {
        try {
          const rows = await listWorkspaceScheduleMdddFlowProjections(w.id);
          return rows.map((p) => ({ ...p, workspaceName: w.name }));
        } catch {
          return [] as (ScheduleMdddFlowProjection & { workspaceName: string })[];
        }
      }),
    ).then((results) => {
      if (!cancelled) setAllProjections(results.flat());
    }).catch(() => {
      if (!cancelled) setAllProjections([]);
    });
    return () => {
      cancelled = true;
    };
  }, [workspaces]);

  // Bookings with a known start time – used for calendar cell placement
  const calendarEvents = useMemo(
    () => bookingRows.filter((row) => row.item.startAtISO != null),
    [bookingRows],
  );

  // ── URL helpers ─────────────────────────────────────────────────────────────
  /**
   * Builds a relative URL for this page with the given view/status overrides.
   *
   * Supported view modes: "list" (default, no param), "calendar", "dispatcher".
   * Supported status tabs: "upcoming" (default, no param), plus the other STATUS_TABS values.
   */
  function buildUrl(overrides: { view?: ViewMode; status?: StatusTab }): string {
    const params = new URLSearchParams();
    const v = overrides.view ?? viewMode;
    const s = overrides.status ?? activeTab;
    if (v !== "list") params.set("view", v);
    if (s !== "upcoming") params.set("status", s);
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  }

  function handleViewChange(v: ViewMode) {
    router.replace(buildUrl({ view: v }));
  }

  function handleTabChange(tab: StatusTab) {
    router.replace(buildUrl({ status: tab }));
  }

  // ── Guard ───────────────────────────────────────────────────────────────────
  if (!activeOrganizationId) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  // ── Shared view-mode icon buttons ───────────────────────────────────────────
  const viewIcons = (
    <>
      <button
        type="button"
        onClick={() => handleViewChange("list")}
        className={`rounded-md p-1.5 transition-colors ${
          viewMode === "list"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/50"
        }`}
        aria-label="列表檢視"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => handleViewChange("calendar")}
        className={`rounded-md p-1.5 transition-colors ${
          viewMode === "calendar"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/50"
        }`}
        aria-label="月曆檢視"
      >
        <CalendarDays className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => handleViewChange("dispatcher")}
        className={`rounded-md p-1.5 transition-colors ${
          viewMode === "dispatcher"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/50"
        }`}
        aria-label="調度台"
      >
        <GanttChart className="h-4 w-4" />
      </button>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // DISPATCHER VIEW  (?view=dispatcher)
  // ════════════════════════════════════════════════════════════════════════════
  if (viewMode === "dispatcher") {
    return (
      <div className="flex flex-col">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <GanttChart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">調度台</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              今日調度
            </span>
          </div>
          <div className="flex items-center gap-1">{viewIcons}</div>
        </div>
        <div className="flex-1 p-4" style={{ minHeight: "520px" }}>
          <DispatcherView />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (viewMode === "list") {
    const activeLabel = STATUS_TABS.find((t) => t.value === activeTab)?.label ?? "即將到來";

    return (
      <div className="flex flex-col">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-4 py-2">
          {/* Left: status tabs + filter button */}
          <div className="flex flex-wrap items-center gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Filter className="h-3.5 w-3.5" />
              篩選
            </button>
          </div>

          {/* Right: saved filters dropdown + view icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <Filter className="h-3.5 w-3.5" />
              已儲存的篩選條件
              <ChevronLeft className="h-3.5 w-3.5 -rotate-90" />
            </button>
            {viewIcons}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1">
          {loadState === "loading" && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground">載入排程中…</p>
            </div>
          )}

          {loadState === "error" && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-destructive">讀取排程失敗，請稍後重新整理頁面。</p>
            </div>
          )}

          {/* Empty state – icon + heading + description */}
          {loadState === "loaded" && bookingRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                暫無 {activeLabel} 的預約
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                沒有 {activeLabel}{" "}
                的預約。只要有人預約了時段，立即會在這裡顯示。
              </p>
            </div>
          )}

          {/* Booking rows */}
          {loadState === "loaded" && bookingRows.length > 0 && (
            <ul className="divide-y divide-border/40">
              {bookingRows.map((row) => (
                <li
                  key={`${row.workspaceId}-${row.item.id}`}
                  className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{row.item.title}</p>
                      <Badge variant="secondary">
                        {ITEM_TYPE_LABEL[row.item.type]}
                      </Badge>
                    </div>
                    {row.item.detail && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {row.item.detail}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                    <span className="tabular-nums">{row.item.timeLabel}</span>
                    <Link
                      href={`/workspace/${row.workspaceId}?tab=Schedule`}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {row.workspaceName}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* ── 待分派 section: cross-workspace pending resource requests ── */}
          {(() => {
            const pendingProjections = allProjections.filter(
              (p) => p.requestStatus === "submitted" || p.requestStatus === "under-review",
            );
            if (pendingProjections.length === 0) return null;
            return (
              <div className="border-t border-border/40 px-4 py-3">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    待分派資源請求
                  </span>
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {pendingProjections.length}
                  </span>
                </div>
                <ul className="divide-y divide-border/40 overflow-hidden rounded-md border border-border/50">
                  {pendingProjections.map((p) => (
                    <li
                      key={p.requestId}
                      className="flex w-full items-center justify-between bg-background px-4 py-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={p.requestStatus === "submitted" ? "secondary" : "default"}>
                            {p.requestStatus === "submitted" ? "已提交" : "審查中"}
                          </Badge>
                          <Link
                            href={`/workspace/${p.workspaceId}?tab=Schedule`}
                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                          >
                            {p.workspaceName}
                          </Link>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          更新：{new Date(p.updatedAtISO).toLocaleString("zh-TW")}
                          {p.lastReason ? ` · ${p.lastReason}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {p.requestStatus === "submitted" && (
                          <Link
                            href={`/workspace/${p.workspaceId}?tab=Schedule`}
                            className="flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <Users className="h-3 w-3" />
                            前往分派
                          </Link>
                        )}
                        {p.requestStatus === "under-review" && p.assigneeAccountUserId && (
                          <span className="text-xs text-muted-foreground">
                            指派給 {p.assigneeAccountUserId.slice(0, 8)}…
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CALENDAR VIEW  (?view=calendar)  – full weekly grid
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-4 py-2">
        {/* Left: date range chip */}
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground">
          <span>{formatWeekRange(weekSunday)}</span>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Right: today + prev/next + view icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            今天
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p - 1)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="上一週"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p + 1)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="下一週"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {viewIcons}
        </div>
      </div>

      {/* ── Week grid ── */}
      <div className="overflow-auto">
        <div className="min-w-[560px]">
          {/* Column headers: GMT+8 | 週日 D … 週六 D */}
          <div className="sticky top-0 z-10 grid grid-cols-[3rem_repeat(7,1fr)] border-b border-border/40 bg-background">
            <div className="border-r border-border/40 px-1 py-2 text-center text-[10px] text-muted-foreground">
              GMT+8
            </div>
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={i}
                  className="border-r border-border/40 py-2 text-center last:border-r-0"
                >
                  <span className="block text-[11px] text-muted-foreground">
                    {DAYS_ZH[day.getDay()]}
                  </span>
                  <span
                    className={`mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* One row per hour */}
          {HOURS.map((hour) => {
            // lineOffset: pixel position of current-time line within this hour row (−1 = not in this row)
            const nowInThisHour =
              weekDays.some((d) => isSameDay(d, today)) &&
              nowMinutes >= hour * 60 &&
              nowMinutes < (hour + 1) * 60;
            const lineOffset = nowInThisHour ? ((nowMinutes - hour * 60) / 60) * 48 : -1;

            return (
              <div
                key={hour}
                className="relative grid grid-cols-[3rem_repeat(7,1fr)] border-b border-border/40"
                style={{ height: "48px" }}
              >
                {/* Time label */}
                <div className="flex items-start justify-end border-r border-border/40 pr-2 pt-1">
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>

                {/* Day cells */}
                {weekDays.map((day, di) => {
                  const isCurrentDay = isSameDay(day, today);
                  const cellEvents = calendarEvents.filter((row) => {
                    if (!row.item.startAtISO) return false;
                    const d = new Date(row.item.startAtISO);
                    return isSameDay(d, day) && d.getHours() === hour;
                  });
                  return (
                    <div
                      key={di}
                      className="relative border-r border-border/40 last:border-r-0"
                    >
                      {/* Current-time indicator line */}
                      {isCurrentDay && lineOffset >= 0 && (
                        <div
                          className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
                          style={{ top: `${lineOffset}px` }}
                        >
                          <div className="h-px flex-1 bg-primary" />
                        </div>
                      )}
                      {/* Booking chips */}
                      {cellEvents.map((row) => (
                        <Link
                          key={`${row.workspaceId}-${row.item.id}`}
                          href={`/workspace/${row.workspaceId}?tab=Schedule`}
                          className="absolute inset-x-0.5 inset-y-0.5 overflow-hidden rounded bg-primary/20 px-1 hover:bg-primary/30"
                        >
                          <p className="truncate text-[11px] font-medium text-primary">
                            {row.item.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Bottom boundary row – shows midnight label (00:00 = start of next day) */}
          <div className="grid grid-cols-[3rem_repeat(7,1fr)]">
            <div className="flex items-start justify-end pr-2 pt-1">
              <span className="text-[10px] tabular-nums text-muted-foreground">00:00</span>
            </div>
            {weekDays.map((_, di) => (
              <div key={di} className="border-r border-border/40 last:border-r-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
